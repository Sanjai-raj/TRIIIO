import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Server } from 'socket.io';
import http from 'http';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import cookieParser from 'cookie-parser';

import streamifier from 'streamifier';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Cart from './models/Cart.js';
import Wishlist from './models/Wishlist.js';

dotenv.config();

// --- SERVICES CONFIG ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
  secure: true,
});

if (!process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET) {
  console.error('Missing Cloudinary env var(s). Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env');
  process.exit(1);
}


const mask = s => (typeof s === 'string' ? s.slice(0, 4) + '...' : s);
console.log('CLOUDINARY env presence:',
  !!process.env.CLOUDINARY_CLOUD_NAME,
  !!process.env.CLOUDINARY_API_KEY,
  !!process.env.CLOUDINARY_API_SECRET
);
console.log('CLOUDINARY values (masked):',
  'cloud_name=', mask(process.env.CLOUDINARY_CLOUD_NAME),
  'api_key=', mask(process.env.CLOUDINARY_API_KEY),
  'api_secret=', mask(process.env.CLOUDINARY_API_SECRET)
);

console.log('ENV CHECK:');
console.log('CLOUDINARY_API_KEY present?', !!process.env.CLOUDINARY_API_KEY);
console.log('RAZORPAY_KEY_ID present?', !!process.env.RAZORPAY_KEY_ID);
console.log('JWT_SECRET present?', !!process.env.JWT_SECRET);

// --- CONFIG ---
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "http://192.168.56.1:3000"], // Explicit origin required for credentials
  credentials: true
}) as any);
app.use(express.json() as any);
app.use(cookieParser() as any);

// --- DB CONNECTION ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mens-threads')
  .then(() => {
    console.log('MongoDB Connected');
    console.log("Connected DB:", mongoose.connection.name);
  })
  .catch(err => console.log('DB Error', err));

// --- MODELS ---
// Models imported from ./models

// --- SERVICES ---
// --- SERVICES ---
// Cloudinary config moved to top


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_12345',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret'
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
});

const uploadToCloudinary = (buffer: Buffer): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'products' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Email Transporter (Mock setup if no real credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or smtp.mailtrap.io
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD
  }
});

const sendOrderEmail = async (order: any) => {
  try {
    if (!process.env.ADMIN_EMAIL) return;
    await transporter.sendMail({
      from: '"Mens Threads" <noreply@mensthreads.com>',
      to: process.env.ADMIN_EMAIL,
      subject: `New Order #${order._id}`,
      text: `New order of amount $${order.orderAmount} received from User ID ${order.user}. Payment Status: ${order.paymentStatus}`
    });
  } catch (e) {
    console.error("Email failed", e);
  }
};

// --- MIDDLEWARE ---
const auth = async (req: any, res: Response, next: NextFunction) => {
  try {
    // Read from cookie first, fall back to header (optional, but good for testing)
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) throw new Error();

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error();

    // Check if user is active
    if (user.isActive === false) {
      res.status(403).send({ message: 'Account has been blocked. Contact support.' });
      return;
    }

    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ message: 'Please authenticate' });
  }
};

const owner = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user.role !== 'owner') {
    res.status(403).send({ message: 'Access denied' });
    return;
  }
  next();
};

// --- ROUTES ---

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "TRIIIO Backend",
    timestamp: new Date().toISOString(),
  });
});

// Auth
app.post('/api/auth/signup', async (req: any, res: any) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, isActive: true });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Adjusted for local dev vs prod
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(201).json({ token, user, message: 'Signup successful' });
  } catch (e) {
    console.error('Signup error:', e);
    res.status(500).json({ message: 'Error creating user' });
  }
});

app.post('/api/auth/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Check Active Status
    if (user.isActive === false) {
      return res.status(403).send({ message: 'Account blocked. Please contact support.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ token, user, message: 'Login successful' });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ message: 'Error logging in' });
  }
});

app.post('/api/auth/logout', (req: any, res: any) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
  res.send({ message: 'Logged out successfully' });
});

app.get('/api/auth/me', auth as any, (req: any, res: { send: (arg0: any) => void; }) => {
  res.send(req.user);
});

// Cloudinary Signature Endpoint (for client-side uploads or debugging)
app.get('/api/upload-sign', (req, res) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    // paramsToSign must match exactly what is sent to Cloudinary
    const paramsToSign: any = {
      folder: 'products',
      timestamp,
    };

    // Build stringToSign: keys sorted lexicographically
    const stringToSign = Object.keys(paramsToSign)
      .sort()
      .map((k) => `${k}=${paramsToSign[k]}`)
      .join('&');

    const signature = crypto
      .createHash('sha1')
      .update(stringToSign + process.env.CLOUDINARY_API_SECRET)
      .digest('hex');

    res.json({
      signature,
      timestamp,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      folder: paramsToSign.folder,
    });
  } catch (err: any) {
    console.error('upload-sign error', err);
    res.status(500).json({ message: 'sign error' });
  }
});

// Products
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const { search, category, sort, size, color, limit, minPrice, maxPrice, status } = req.query;
    let query: any = {};

    // Filter by status (default to 'active' for public view, allow 'all' for admin)
    if (status === 'all') {
      // No status filter
    } else if (status) {
      query.status = status;
    } else {

      query.status = 'active';
    }

    if (search) query.name = { $regex: search as string, $options: 'i' };
    if (category) query.category = category;
    if (size) query.sizes = size;
    if (color) query.colors = color;

    // Price Range Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let products = Product.find(query);
    if (sort === 'price_asc') products = products.sort({ price: 1 });
    if (sort === 'price_desc') products = products.sort({ price: -1 });
    if (limit) products = products.limit(Number(limit));

    res.send(await products.exec() as any);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.get('/api/products/:id', async (req: { params: { id: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (): void; new(): any; }; }; send: (arg0: mongoose.Document<unknown, {}, { rating: number; tags: string[]; sizes: string[]; variants: mongoose.Types.DocumentArray<{ stock?: number | null | undefined; size?: string | null | undefined; }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, { stock?: number | null | undefined; size?: string | null | undefined; }> & { stock?: number | null | undefined; size?: string | null | undefined; }>; colors: string[]; status: string; images: mongoose.Types.DocumentArray<{ url?: string | null | undefined; publicId?: string | null | undefined; }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, { url?: string | null | undefined; publicId?: string | null | undefined; }> & { url?: string | null | undefined; publicId?: string | null | undefined; }>; reviews: mongoose.Types.DocumentArray<{ date: NativeDate; comment?: string | null | undefined; user?: string | null | undefined; userId?: string | null | undefined; rating?: number | null | undefined; }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, { date: NativeDate; comment?: string | null | undefined; user?: string | null | undefined; userId?: string | null | undefined; rating?: number | null | undefined; }> & { date: NativeDate; comment?: string | null | undefined; user?: string | null | undefined; userId?: string | null | undefined; rating?: number | null | undefined; }>; name?: string | null | undefined; description?: string | null | undefined; category?: string | null | undefined; brand?: string | null | undefined; price?: number | null | undefined; discount?: number | null | undefined; stock?: number | null | undefined; } & mongoose.DefaultTimestampProps, { id: string; }, { timestamps: true; }> & Omit<{ rating: number; tags: string[]; sizes: string[]; variants: mongoose.Types.DocumentArray<{ stock?: number | null | undefined; size?: string | null | undefined; }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, { stock?: number | null | undefined; size?: string | null | undefined; }> & { stock?: number | null | undefined; size?: string | null | undefined; }>; colors: string[]; status: string; images: mongoose.Types.DocumentArray<{ url?: string | null | undefined; publicId?: string | null | undefined; }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, { url?: string | null | undefined; publicId?: string | null | undefined; }> & { url?: string | null | undefined; publicId?: string | null | undefined; }>; reviews: mongoose.Types.DocumentArray<{ date: NativeDate; comment?: string | null | undefined; user?: string | null | undefined; userId?: string | null | undefined; rating?: number | null | undefined; }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, { date: NativeDate; comment?: string | null | undefined; user?: string | null | undefined; userId?: string | null | undefined; rating?: number | null | undefined; }> & { date: NativeDate; comment?: string | null | undefined; user?: string | null | undefined; userId?: string | null | undefined; rating?: number | null | undefined; }>; name?: string | null | undefined; description?: string | null | undefined; category?: string | null | undefined; brand?: string | null | undefined; price?: number | null | undefined; discount?: number | null | undefined; stock?: number | null | undefined; } & mongoose.DefaultTimestampProps & { _id: mongoose.Types.ObjectId; } & { __v: number; }, "id"> & { id: string; }) => void; }) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return (res as any).status(404).send();
    res.send(product as any);
  } catch (e) { (res as any).status(500).send(); }
});

app.post(
  "/api/products",
  auth as any,
  owner as any,
  upload.array("images", 5) as any,
  async (req: any, res: any) => {
    try {
      const {
        name,
        description,
        price,
        discount,
        category,
        brand,
        stock,
        colors,
        variants,
        tags,
      } = req.body;

      // Upload images
      const imageResults = await Promise.all(
        (req.files as Express.Multer.File[]).map(file =>
          uploadToCloudinary(file.buffer)
        )
      );

      const images = imageResults.map((img: any) => ({
        url: img.secure_url,
        publicId: img.public_id,
      }));

      const product = await Product.create({
        name,
        description,
        price,
        discount,
        finalPrice: price - (price * discount) / 100,
        category,
        brand,
        countInStock: stock,
        colors: JSON.parse(colors || "[]"),
        variants: JSON.parse(variants || "[]"),
        tags: JSON.parse(tags || "[]"),
        images,
      });

      res.status(201).json(product);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: "Product creation failed" });
    }
  }
);

app.put('/api/products/:id', auth as any, owner as any, upload.array('images', 5) as any, async (req: any, res: any) => {
  try {
    const product: any = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 1️⃣ Parse existing images safely
    let existingImages: any[] = [];
    if (req.body.existingImages) {
      try {
        existingImages = JSON.parse(req.body.existingImages);
      } catch (e) {
        console.error("Error parsing existingImages", e);
        return res.status(400).json({ message: "Invalid existingImages data" });
      }
    }

    // 2️⃣ Find removed images (to delete from Cloudinary)
    // product.images contains db state, existingImages contains frontend state
    const removedImages = product.images.filter(
      (img: any) => !existingImages.some((e: any) => e.publicId === img.publicId)
    );

    // 3️⃣ Delete removed images from Cloudinary
    for (const img of removedImages) {
      if (img.publicId) {
        try {
          await cloudinary.uploader.destroy(img.publicId);
        } catch (err) {
          console.error(`Failed to delete image ${img.publicId}`, err);
        }
      }
    }

    // 4️⃣ Upload new images (if any)
    const uploadedImages: any[] = [];
    const files = req.files as Express.Multer.File[];

    if (files && files.length > 0) {
      // Use safe stream upload
      const imageResults = await Promise.all(
        files.map(file => uploadToCloudinary(file.buffer))
      );

      imageResults.forEach(img => {
        uploadedImages.push({
          url: img.secure_url,
          publicId: img.public_id,
        });
      });
    }

    // 5️⃣ Update product fields
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price ? Number(req.body.price) : product.price;
    product.discount = req.body.discount !== undefined ? Number(req.body.discount) : product.discount;

    // Recalc final price
    product.finalPrice = product.price - (product.price * (product.discount || 0) / 100);

    product.category = req.body.category || product.category;
    product.brand = req.body.brand || product.brand;
    product.countInStock = req.body.stock ? Number(req.body.stock) : product.countInStock;
    product.stock = product.countInStock; // Sync fields

    if (req.body.colors) product.colors = JSON.parse(req.body.colors);
    if (req.body.variants) product.variants = JSON.parse(req.body.variants);
    if (req.body.tags) product.tags = JSON.parse(req.body.tags);

    // 6️⃣ Final image array
    product.images = [...existingImages, ...uploadedImages];

    await product.save();
    res.json(product);

  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    res.status(500).json({ message: "Product update failed" });
  }
});

app.post('/api/products/:id/reviews', auth as any, async (req: any, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: unknown): void; new(): any; }; }; }) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return (res as any).status(404).send();

    const review = {
      user: req.user.name,
      userId: req.user._id,
      rating: Number(rating),
      comment,
      date: new Date()
    };

    product.reviews.push(review);

    // Recalculate avg
    const total = product.reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    product.rating = total / product.reviews.length;

    await product.save();
    res.status(201).send(product as any);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.delete('/api/products/:id', auth as any, owner as any, async (req: { params: { id: any; }; }, res: { send: (arg0: { success: boolean; }) => void; status: (arg0: number) => { (): any; new(): any; send: { (arg0: unknown): void; new(): any; }; }; }) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.send({ success: true });
  } catch (e) {
    res.status(500).send(e);
  }
});

// Orders & Payment
app.post('/api/orders/create', auth as any, async (req: any, res: { send: (arg0: { id: any; dbOrderId: mongoose.Types.ObjectId; method: string; amount?: any; key?: string | undefined; }) => void; status: (arg0: number) => { (): any; new(): any; send: { (arg0: { message: string; }): void; new(): any; }; }; }) => {
  try {
    const { items, orderAmount, shippingAddress, paymentMethod } = req.body;

    // Create DB Order
    const order = new Order({
      user: req.user._id,
      items,
      orderAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'Online',
      paymentStatus: 'Pending',
      orderStatus: 'Pending' // Initial state
    });

    // Handle COD logic
    if (paymentMethod === 'COD') {
      order.orderStatus = 'Confirmed';
      await order.save();

      // Notify Admin for COD
      io.emit('new-order', { orderId: order._id, amount: order.orderAmount });
      sendOrderEmail(order);

      return res.send({
        id: 'cod_success',
        dbOrderId: order._id,
        method: 'COD'
      });
    }

    // Handle Online (Razorpay) logic
    await order.save();
    const rzpOrder = await razorpay.orders.create({
      amount: orderAmount * 100, // paise
      currency: "INR",
      receipt: order._id.toString()
    });

    res.send({
      id: rzpOrder.id, // Razorpay ID
      amount: rzpOrder.amount,
      key: process.env.RAZORPAY_KEY_ID,
      dbOrderId: order._id,
      method: 'Online'
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: 'Order creation failed' });
  }
});

app.post('/api/payment/verify', auth as any, async (req: { body: { razorpay_order_id: any; razorpay_payment_id: any; razorpay_signature: any; dbOrderId: any; }; }, res: { send: (arg0: { status: string; }) => void; status: (arg0: number) => { (): any; new(): any; send: { (arg0: unknown): void; new(): any; }; }; }) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Payment Success
      const order = await Order.findByIdAndUpdate(dbOrderId, {
        paymentStatus: 'Paid',
        orderStatus: 'Confirmed',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id
      }, { new: true });

      // Notify Admin
      io.emit('new-order', { orderId: dbOrderId, amount: order?.orderAmount });
      sendOrderEmail(order);

      res.send({ status: 'success' });
    } else {
      await Order.findByIdAndUpdate(dbOrderId, { paymentStatus: 'Failed' });
      res.status(400).send({ status: 'failure' });
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

// Owner Orders Route - ENHANCED FILTERING
app.get('/api/orders', auth as any, owner as any, async (req: any, res: { send: (arg0: (mongoose.Document<unknown, {}, { items: any[]; paymentMethod: string; paymentStatus: string; orderStatus: string; user?: mongoose.Types.ObjectId | null | undefined; shippingAddress?: any; orderAmount?: number | null | undefined; razorpayOrderId?: string | null | undefined; razorpayPaymentId?: string | null | undefined; } & mongoose.DefaultTimestampProps, { id: string; }, { timestamps: true; }> & Omit<{ items: any[]; paymentMethod: string; paymentStatus: string; orderStatus: string; user?: mongoose.Types.ObjectId | null | undefined; shippingAddress?: any; orderAmount?: number | null | undefined; razorpayOrderId?: string | null | undefined; razorpayPaymentId?: string | null | undefined; } & mongoose.DefaultTimestampProps & { _id: mongoose.Types.ObjectId; } & { __v: number; }, "id"> & { id: string; })[]) => void; status: (arg0: number) => { (): any; new(): any; send: { (arg0: unknown): void; new(): any; }; }; }) => {
  try {
    const { status, search, date } = req.query;
    let query: any = {};

    if (status) query.orderStatus = status;

    if (date) {
      const d = new Date(date as string);
      const nextDay = new Date(d);
      nextDay.setDate(d.getDate() + 1);
      query.createdAt = { $gte: d, $lt: nextDay };
    }

    if (search) {
      // Simple ID search (in real app, we might search user name via aggregation)
      // Mongoose casting check if it's a valid ObjectId
      if (mongoose.Types.ObjectId.isValid(search as string)) {
        query._id = search;
      }
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.send(orders);
  } catch (e) {
    res.status(500).send(e);
  }
});

// User My Orders Route
app.get('/api/orders/myorders', auth as any, async (req: any, res: { send: (arg0: (mongoose.Document<unknown, {}, { items: any[]; paymentMethod: string; paymentStatus: string; orderStatus: string; user?: mongoose.Types.ObjectId | null | undefined; shippingAddress?: any; orderAmount?: number | null | undefined; razorpayOrderId?: string | null | undefined; razorpayPaymentId?: string | null | undefined; } & mongoose.DefaultTimestampProps, { id: string; }, { timestamps: true; }> & Omit<{ items: any[]; paymentMethod: string; paymentStatus: string; orderStatus: string; user?: mongoose.Types.ObjectId | null | undefined; shippingAddress?: any; orderAmount?: number | null | undefined; razorpayOrderId?: string | null | undefined; razorpayPaymentId?: string | null | undefined; } & mongoose.DefaultTimestampProps & { _id: mongoose.Types.ObjectId; } & { __v: number; }, "id"> & { id: string; })[]) => void; status: (arg0: number) => { (): any; new(): any; send: { (arg0: unknown): void; new(): any; }; }; }) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.send(orders);
  } catch (e) {
    res.status(500).send(e);
  }
});

// User Single Order Route (for Success Page)
app.get('/api/orders/:id', auth as any, async (req: any, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: unknown): void; new(): any; }; }; send: (arg0: mongoose.Document<unknown, {}, { items: any[]; paymentMethod: string; paymentStatus: string; orderStatus: string; user?: mongoose.Types.ObjectId | null | undefined; shippingAddress?: any; orderAmount?: number | null | undefined; razorpayOrderId?: string | null | undefined; razorpayPaymentId?: string | null | undefined; } & mongoose.DefaultTimestampProps, { id: string; }, { timestamps: true; }> & Omit<{ items: any[]; paymentMethod: string; paymentStatus: string; orderStatus: string; user?: mongoose.Types.ObjectId | null | undefined; shippingAddress?: any; orderAmount?: number | null | undefined; razorpayOrderId?: string | null | undefined; razorpayPaymentId?: string | null | undefined; } & mongoose.DefaultTimestampProps & { _id: mongoose.Types.ObjectId; } & { __v: number; }, "id"> & { id: string; }) => void; }) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).send({ message: 'Order not found' });
    res.send(order);
  } catch (e) {
    res.status(500).send(e);
  }
});

// User Cancel Order
app.put('/api/orders/:id/cancel', auth as any, async (req: any, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: unknown): void; new(): any; }; }; send: (arg0: mongoose.Document<unknown, {}, { items: any[]; paymentMethod: string; paymentStatus: string; orderStatus: string; user?: mongoose.Types.ObjectId | null | undefined; shippingAddress?: any; orderAmount?: number | null | undefined; razorpayOrderId?: string | null | undefined; razorpayPaymentId?: string | null | undefined; } & mongoose.DefaultTimestampProps, { id: string; }, { timestamps: true; }> & Omit<{ items: any[]; paymentMethod: string; paymentStatus: string; orderStatus: string; user?: mongoose.Types.ObjectId | null | undefined; shippingAddress?: any; orderAmount?: number | null | undefined; razorpayOrderId?: string | null | undefined; razorpayPaymentId?: string | null | undefined; } & mongoose.DefaultTimestampProps & { _id: mongoose.Types.ObjectId; } & { __v: number; }, "id"> & { id: string; }) => void; }) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return (res as any).status(404).send();

    // Only allow cancellation if pending or confirmed
    if (['Shipped', 'Delivered', 'Cancelled'].includes(order.orderStatus)) {
      return res.status(400).send({ message: 'Cannot cancel order at this stage' });
    }

    order.orderStatus = 'Cancelled';
    await order.save();

    // Notify admin
    io.emit('new-order', { orderId: order._id, amount: order.orderAmount, status: 'Cancelled' });

    res.send(order);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Admin Update Order (Status or generic updates)
app.put('/api/orders/:id', auth as any, owner as any, async (req: { body: { orderStatus: any; paymentStatus: any; }; params: { id: any; }; }, res: { send: (arg0: (mongoose.Document<unknown, {}, { items: any[]; paymentMethod: string; paymentStatus: string; orderStatus: string; user?: mongoose.Types.ObjectId | null | undefined; shippingAddress?: any; orderAmount?: number | null | undefined; razorpayOrderId?: string | null | undefined; razorpayPaymentId?: string | null | undefined; } & mongoose.DefaultTimestampProps, { id: string; }, { timestamps: true; }> & Omit<{ items: any[]; paymentMethod: string; paymentStatus: string; orderStatus: string; user?: mongoose.Types.ObjectId | null | undefined; shippingAddress?: any; orderAmount?: number | null | undefined; razorpayOrderId?: string | null | undefined; razorpayPaymentId?: string | null | undefined; } & mongoose.DefaultTimestampProps & { _id: mongoose.Types.ObjectId; } & { __v: number; }, "id"> & { id: string; }) | null) => void; status: (arg0: number) => { (): any; new(): any; send: { (arg0: unknown): void; new(): any; }; }; }) => {
  try {
    // Allow updating status or other fields
    const { orderStatus, paymentStatus } = req.body;
    const updateData: any = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('user', 'name email');
    res.send(order as any);
  } catch (e) {
    res.status(500).send(e);
  }
});

// --- ADDRESS MANAGEMENT ROUTES ---

app.get('/api/users/addresses', auth as any, async (req: any, res: any) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.addresses || []);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching addresses' });
  }
});

app.post('/api/users/addresses', auth as any, async (req: any, res: any) => {
  try {
    const user: any = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.body.isDefault) {
      user.addresses.forEach((addr: any) => addr.isDefault = false);
    }

    user.addresses.push(req.body);
    await user.save();
    res.json(user.addresses);
  } catch (e) {
    res.status(500).json({ message: 'Error adding address' });
  }
});

app.put('/api/users/addresses/:id', auth as any, async (req: any, res: any) => {
  try {
    const user: any = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const addressIndex = user.addresses.findIndex((addr: any) => addr._id.toString() === req.params.id);
    if (addressIndex === -1) return res.status(404).json({ message: 'Address not found' });

    if (req.body.isDefault) {
      user.addresses.forEach((addr: any) => addr.isDefault = false);
    }

    // Merge updates
    const updatedAddress = { ...user.addresses[addressIndex].toObject(), ...req.body };
    user.addresses[addressIndex] = updatedAddress;

    await user.save();
    res.json(user.addresses);
  } catch (e) {
    res.status(500).json({ message: 'Error updating address' });
  }
});

app.delete('/api/users/addresses/:id', auth as any, async (req: any, res: any) => {
  try {
    const user: any = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.addresses = user.addresses.filter((addr: any) => addr._id.toString() !== req.params.id);
    await user.save();
    res.json(user.addresses);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error deleting address' });
  }
});

// --- ADMIN USER MANAGEMENT ---

// List Users
app.get('/api/admin/users', auth as any, owner as any, async (req: any, res: { send: (arg0: any[]) => void; status: (arg0: number) => { (): any; new(): any; send: { (arg0: unknown): void; new(): any; }; }; }) => {
  try {
    // Aggregate users with their order counts
    const users = await User.aggregate([
      // Only generic users, maybe skip owners to keep list clean? or include all. Let's include all.
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'user',
          as: 'orders'
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          role: 1,
          phone: 1,
          isActive: 1,
          createdAt: 1,
          orderCount: { $size: '$orders' }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Toggle User Block Status
app.put('/api/admin/users/:id', auth as any, owner as any, async (req: { params: { id: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: unknown): void; new(): any; }; }; send: (arg0: mongoose.Document<unknown, {}, { name: string; email: string; password: string; role: "user" | "owner"; isActive: boolean; phone?: string | null | undefined; } & mongoose.DefaultTimestampProps, { id: string; }, { timestamps: true; }> & Omit<{ name: string; email: string; password: string; role: "user" | "owner"; isActive: boolean; phone?: string | null | undefined; } & mongoose.DefaultTimestampProps & { _id: mongoose.Types.ObjectId; } & { __v: number; }, "id"> & { id: string; }) => void; }) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ message: 'User not found' });

    if (user.role === 'owner') return res.status(400).send({ message: 'Cannot block admins' });

    user.isActive = !user.isActive;
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Admin Stats
app.get('/api/admin/stats', auth as any, owner as any, async (req: any, res: { send: (arg0: { totalOrders: number; lowStockCount: number; userCount: number; totalRevenue: any; recentOrders: (mongoose.Document<unknown, {}, { items: any[]; paymentMethod: string; paymentStatus: string; orderStatus: string; user?: mongoose.Types.ObjectId | null | undefined; shippingAddress?: any; orderAmount?: number | null | undefined; razorpayOrderId?: string | null | undefined; razorpayPaymentId?: string | null | undefined; } & mongoose.DefaultTimestampProps, { id: string; }, { timestamps: true; }> & Omit<{ items: any[]; paymentMethod: string; paymentStatus: string; orderStatus: string; user?: mongoose.Types.ObjectId | null | undefined; shippingAddress?: any; orderAmount?: number | null | undefined; razorpayOrderId?: string | null | undefined; razorpayPaymentId?: string | null | undefined; } & mongoose.DefaultTimestampProps & { _id: mongoose.Types.ObjectId; } & { __v: number; }, "id"> & { id: string; })[]; }) => void; }) => {
  const totalOrders = await Order.countDocuments();
  const lowStockCount = await Product.countDocuments({ stock: { $lt: 5 } });
  const userCount = await User.countDocuments({ role: 'user' });
  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

  // Simple revenue aggregation
  const revenueAgg = await Order.aggregate([
    { $match: { paymentStatus: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$orderAmount' } } }
  ]);
  const totalRevenue = revenueAgg[0]?.total || 0;

  res.send({ totalOrders, lowStockCount, userCount, totalRevenue, recentOrders });
});

app.get('/api/home-sections', (req, res) => {
  const sections = [
    {
      id: 1,
      title: "YOUR NEXT LOOK AWAITS",
      description: "Discover shirts that feel effortless, confident, and modern. Designed for everyday comfort and timeless style.",
      cta: "SHOP SHIRTS",
      image: "/hero_cover.png",
      bg: "#f8f6f2",
      align: "left"
    },
    {
      id: 2,
      title: "EFFORTLESS CASUALS",
      description: "Relaxed fits designed for everyday comfort.",
      cta: "EXPLORE CASUALS",
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
      bg: "#ffffff",
      align: "right"
    },
    {
      id: 3,
      title: "MODERN & SMART",
      description: "Versatile shirts that move from work to weekend. Minimal design with maximum impact.",
      cta: "VIEW COLLECTION",
      image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80",
      bg: "#f4f5f7",
      align: "left"
    }
  ];
  res.json(sections);
});

// --- CART ROUTES ---
app.get('/api/cart', auth as any, async (req: any, res: any) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.send(cart);
  } catch (e) { res.status(500).send(e); }
});

app.post('/api/cart/add', auth as any, async (req: any, res: any) => {
  try {
    const { productId, quantity, size, color } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex((p: any) =>
      p.product.toString() === productId && p.selectedSize === size && p.selectedColor === color
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({ product: productId, quantity: quantity || 1, selectedSize: size, selectedColor: color });
    }
    await cart.save();
    // Re-fetch to populate
    const newCart = await Cart.findById(cart._id).populate('items.product');
    res.send(newCart);
  } catch (e) { res.status(500).send(e); }
});

app.post('/api/cart/update', auth as any, async (req: any, res: any) => {
  try {
    const { itemId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).send();

    // Find item by SubDocument ID (which MongoDB assigns to items array elements)
    // Or we can find by index if mapped from frontend, but itemId is safer
    const item = cart.items.id(itemId);
    if (item) {
      item.quantity = quantity;
      if (quantity <= 0) item.deleteOne();
    }

    await cart.save();
    const newCart = await Cart.findById(cart._id).populate('items.product');
    res.send(newCart);
  } catch (e) { res.status(500).send(e); }
});

app.delete('/api/cart/:itemId', auth as any, async (req: any, res: any) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).send();

    const item = cart.items.id(req.params.itemId);
    if (item) item.deleteOne();

    await cart.save();
    const newCart = await Cart.findById(cart._id).populate('items.product');
    res.send(newCart);
  } catch (e) { res.status(500).send(e); }
});

// --- WISHLIST ROUTES ---
app.get('/api/wishlist', auth as any, async (req: any, res: any) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    res.send(wishlist);
  } catch (e) { res.status(500).send(e); }
});

app.post('/api/wishlist/toggle', auth as any, async (req: any, res: any) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = new Wishlist({ user: req.user._id, products: [] });

    const index = wishlist.products.indexOf(productId);
    if (index > -1) {
      wishlist.products.splice(index, 1); // Remove
    } else {
      wishlist.products.push(productId); // Add
    }
    await wishlist.save();
    const newList = await Wishlist.findById(wishlist._id).populate('products');
    res.send(newList);
  } catch (e) { res.status(500).send(e); }
});


// --- SEEDING ---
const seedOwner = async () => {
  const exists = await User.findOne({ role: 'owner' });
  if (!exists) {
    const hashedPassword = await bcrypt.hash('admin123', 8);
    await User.create({
      name: 'Owner',
      email: 'owner@example.com',
      password: hashedPassword,
      role: 'owner',
      isActive: true
    });
    console.log('Owner seeded: owner@example.com / admin123');
  }
};
seedOwner();

// --- START ---
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
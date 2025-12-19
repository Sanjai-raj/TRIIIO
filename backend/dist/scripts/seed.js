import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
// import models (ensure path correct)
import UserModel from '../models/User.js'; // if you have separate model files
import ProductModel from '../models/Product.js';
import OrderModel from '../models/Order.js';
// --- If you don't split models into separate files, re-declare minimal models here ---
// (The example below assumes you have the model exports. If not, require them from your main file or re-create schemas.)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'mens-threads';
async function connect() {
    await mongoose.connect(MONGO_URI, { dbName: DB_NAME, useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to DB for seeding:', DB_NAME);
}
async function readJson(file) {
    const full = path.join(process.cwd(), 'data', file);
    if (!fs.existsSync(full)) {
        console.warn('File not found', full);
        return null;
    }
    const raw = fs.readFileSync(full, 'utf-8');
    return JSON.parse(raw);
}
async function up() {
    try {
        await connect();
        // Example using your models; adapt names as needed
        // USERS
        const users = await readJson('users.json'); // should be array
        if (users && Array.isArray(users) && users.length) {
            // Optional: hash passwords if provided in plain text
            const hashed = await Promise.all(users.map(async (u) => {
                if (u.password && !u.password.startsWith('$2')) {
                    u.password = await bcrypt.hash(u.password, 8);
                }
                return u;
            }));
            await UserModel.insertMany(hashed, { ordered: false }).catch(e => console.warn('users insert warning', e.message));
            console.log('Inserted users:', users.length);
        }
        // PRODUCTS
        const products = await readJson('products.json');
        if (products && Array.isArray(products) && products.length) {
            await ProductModel.insertMany(products, { ordered: false }).catch(e => console.warn('products insert warning', e.message));
            console.log('Inserted products:', products.length);
        }
        // ORDERS
        const orders = await readJson('orders.json');
        if (orders && Array.isArray(orders) && orders.length) {
            await OrderModel.insertMany(orders, { ordered: false }).catch(e => console.warn('orders insert warning', e.message));
            console.log('Inserted orders:', orders.length);
        }
        console.log('Seeding complete');
    }
    catch (err) {
        console.error('Seed failed', err);
    }
    finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}
up();

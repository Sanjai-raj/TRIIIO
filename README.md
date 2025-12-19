# Men's Threads - MERN Stack Ecommerce

A complete ecommerce solution for Men's Wear with User and Admin portals.

## Quick Start (Demo Mode)
If the backend server is not running, the frontend will automatically switch to **Demo Mode**. 
- Mock data will be used for products and authentication.
- Payment flow will be simulated.
- **Login Credentials:**
  - User: `user@example.com` / (any password)
  - Admin: `owner@example.com` / (any password)

## Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)
- Razorpay Account (for payments)
- Cloudinary Account (for image uploads)

## Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mens-threads
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173

# Payment
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Images
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin
ADMIN_EMAIL=admin@example.com
```

## Installation & Running

### Backend
1. Navigate to `/server`
2. Run `npm install express mongoose cors dotenv bcryptjs jsonwebtoken razorpay cloudinary multer socket.io nodemailer`
3. Run `npm run dev` or `node index.ts` (ensure you have ts-node or compile first)

### Frontend
1. The frontend files are in the root.
2. Run `npm install` (standard React deps + axios, react-router-dom, react-icons, socket.io-client)
3. Run `npm run dev`

## Features
- Role-based Auth (User/Owner)
- Mobile-first responsive design (Tailwind)
- Razorpay Payment Gateway integration
- Real-time Admin Notifications (Socket.io)
- Cloudinary Image Uploads

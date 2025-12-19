import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: Array,
    shippingAddress: {
        fullName: String,
        phone: String,
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        pincode: String,
        country: String,
    },
    orderAmount: Number,
    paymentMethod: { type: String, default: 'Online' }, // Online, COD
    paymentStatus: { type: String, default: 'Pending' }, // Pending, Paid, Failed
    orderStatus: { type: String, default: 'Pending' }, // Pending, Confirmed, Shipped, Delivered, Cancelled, Refunded
    razorpayOrderId: String,
    razorpayPaymentId: String,
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;

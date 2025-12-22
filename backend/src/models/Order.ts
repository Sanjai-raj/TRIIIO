import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orderId: { type: String, unique: true }, // Custom Frontend ID
    items: Array, // Keeps existing name to minimalize refactor, or alias products to it? User asked for "products". I will use items but maybe map it.
    // Actually, user wants "products" in schema.
    products: [
        {
            name: String,
            image: String,
            size: String,
            color: String,
            quantity: Number,
            price: Number,
        }
    ],
    customer: {
        name: String,
        phone: String,
        address: String,
    },
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
    totalAmount: Number, // User requested this name
    orderType: String, // Cart / Buy Now
    paymentMethod: { type: String, default: 'Online' },
    paymentStatus: { type: String, default: 'Pending' },
    orderStatus: { type: String, default: 'Pending' },
    razorpayOrderId: String,
    razorpayPaymentId: String,
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;

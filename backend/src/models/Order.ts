import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        customer: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
        },

        products: [
            {
                name: { type: String, required: true },
                productId: String,
                image: String,
                size: String,
                color: String,
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
            },
        ],

        totalAmount: {
            type: Number,
            required: true,
        },

        orderType: {
            type: String,
            enum: ["CART", "Buy Now", "Cart Order"], // Aligned with frontend values
            default: "Cart Order",
        },

        paymentMethod: {
            type: String,
            default: "Online",
        },

        paymentStatus: {
            type: String,
            default: "Pending",
        },

        orderStatus: {
            type: String,
            default: "Pending",
        },

        razorpayOrderId: String,
        razorpayPaymentId: String,
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

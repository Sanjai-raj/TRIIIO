import mongoose from 'mongoose';
const reviewSchema = new mongoose.Schema({
    user: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
});
const variantSchema = new mongoose.Schema({
    size: String,
    enabled: Boolean,
    stock: Number,
});
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 }, // INR
    discount: { type: Number, required: true, default: 0 },
    finalPrice: { type: Number, required: true, default: 0 }, // INR
    category: { type: String, required: true },
    brand: { type: String, required: true },
    countInStock: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    images: [{
            url: String,
            publicId: String,
        }],
    colors: [String],
    tags: [String],
    variants: [variantSchema],
    reviews: [reviewSchema],
}, {
    timestamps: true,
});
export default mongoose.model('Product', productSchema);

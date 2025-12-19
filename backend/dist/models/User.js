import mongoose from 'mongoose';
const addressSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" },
    isDefault: { type: Boolean, default: false },
}, { _id: true });
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'owner'], default: 'user' },
    phone: String,
    isActive: { type: Boolean, default: true }, // Added for Block/Unblock
    addresses: { type: [addressSchema], default: [] }
}, { timestamps: true });
const User = mongoose.model('User', userSchema);
export default User;

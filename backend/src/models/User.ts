import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        phone: { type: String, required: true }, // shipping phone
        addressLine1: { type: String, required: true },
        addressLine2: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, default: "India" },
        isDefault: { type: Boolean, default: false },
    },
    { _id: true }
);

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },

        // 🔹 OPTIONAL email
        email: {
            type: String,
            lowercase: true,
            trim: true,
            sparse: true, // IMPORTANT for optional unique
        },

        // 🔹 PRIMARY IDENTITY
        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        password: { type: String, required: true },

        role: {
            type: String,
            enum: ["user", "owner"],
            default: "user",
        },

        isActive: { type: Boolean, default: true },

        addresses: {
            type: [addressSchema],
            default: [],
        },
    },
    { timestamps: true }
);

// Indexes (VERY IMPORTANT)
userSchema.index({ phone: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true, sparse: true });

const User = mongoose.model("User", userSchema);
export default User;

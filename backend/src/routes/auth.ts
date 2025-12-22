import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// SIGNUP
router.post('/signup', async (req: any, res: any) => {
    try {
        const { name, phone, email, password } = req.body;

        if (!phone || !password || !name) {
            return res.status(400).json({ message: "Name, phone and password required" });
        }

        // Check Phone uniqueness
        const existingPhone = await User.findOne({ phone });
        if (existingPhone) return res.status(400).json({ message: 'Phone already registered' });

        // Check Email uniqueness (if provided)
        if (email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            phone,
            email: email || undefined,
            password: hashedPassword,
            isActive: true,
        });

        const token = jwt.sign(
            { id: user._id, role: user.role, phone: user.phone },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        const safeUser = {
            id: user._id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            role: user.role,
        };

        // Cookie logic maintained
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(201).json({ token, user: safeUser, message: "Signup successful" });
    } catch (e: any) {
        console.error("Signup error:", e);
        if (e.code === 11000) {
            return res.status(400).json({ message: "Phone or email already exists" });
        }
        res.status(500).json({ message: "Error creating user" });
    }
});

// LOGIN
router.post('/login', async (req: any, res: any) => {
    try {
        const { phoneOrEmail, password } = req.body;

        if (!phoneOrEmail || !password) {
            return res.status(400).json({ message: "Phone/Email and password required" });
        }

        const user = await User.findOne({
            $or: [{ phone: phoneOrEmail }, { email: phoneOrEmail }],
        });

        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        // Check Active Status
        if (user.isActive === false) {
            return res.status(403).json({ message: "Account blocked. Please contact support." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role, phone: user.phone },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        const safeUser = {
            id: user._id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            role: user.role,
        };

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ token, user: safeUser, message: "Login successful" });
    } catch (e) {
        console.error("Login error:", e);
        res.status(500).json({ message: "Error logging in" });
    }
});

router.post('/logout', (req: any, res: any) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    res.send({ message: 'Logged out successfully' });
});

router.get('/me', auth as any, (req: any, res: any) => {
    res.send(req.user);
});

export default router;

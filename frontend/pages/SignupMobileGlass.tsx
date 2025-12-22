import React, { useState } from "react";
import { motion } from "framer-motion";
import { api, handleApiError } from "../src/api/client";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

interface SignupMobileGlassProps {
    onLoginClick?: () => void;
}

const SignupMobileGlass: React.FC<SignupMobileGlassProps> = ({ onLoginClick }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
    const { login } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/signup', formData);
            login(data);
            showToast("Account created successfully!", 'success');
            if (data.user.role === 'owner') navigate('/admin');
            else navigate('/');
        } catch (err: any) {
            showToast(handleApiError(err), 'error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#E6F6F8] to-white px-4 sm:hidden">

            {/* GLASS CARD */}
            <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="
          w-full max-w-[360px]
          rounded-3xl
          border border-white/40
          bg-white/30
          backdrop-blur-xl
          shadow-[0_20px_40px_rgba(0,139,158,0.18)]
          px-8 py-8
          relative
          overflow-hidden
        "
            >
                {/* Glass highlight */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />

                {/* TITLE */}
                <h1
                    className="
            text-3xl
            font-black
            uppercase
            tracking-tighter
            text-center
            mb-6
            text-[#008B9E]
            leading-9
            font-[Inter]
            relative
          "
                >
                    Join Us
                </h1>

                <p className="text-xs text-center text-gray-400 mb-8 uppercase tracking-wide relative">
                    Mobile number will be used for WhatsApp communication.
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Full Name */}
                    <div className="relative w-full h-[50px] mb-5">
                        <input
                            type="text"
                            placeholder="FULL NAME"
                            required
                            className="
                w-full h-full rounded-full
                bg-white/70
                border border-[#008B9E]/30
                px-5
                text-gray-800
                placeholder:uppercase placeholder-gray-400
                focus:outline-none
                focus:ring-2 focus:ring-[#008B9E]/40
                transition
              "
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    {/* Mobile Number */}
                    <div className="relative w-full h-[50px] mb-5">
                        <input
                            type="text"
                            placeholder="MOBILE NUMBER (10 DIGITS)"
                            required
                            pattern="[0-9]{10}"
                            title="Please enter a valid 10-digit mobile number"
                            className="
                w-full h-full rounded-full
                bg-white/70
                border border-[#008B9E]/30
                px-5
                text-gray-800
                placeholder:uppercase placeholder-gray-400
                focus:outline-none
                focus:ring-2 focus:ring-[#008B9E]/40
                transition
              "
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                        />
                    </div>

                    {/* Email (Optional) */}
                    <div className="relative w-full h-[50px] mb-5">
                        <input
                            type="email"
                            placeholder="EMAIL (OPTIONAL)"
                            className="
                w-full h-full rounded-full
                bg-white/70
                border border-[#008B9E]/30
                px-5
                text-gray-800
                placeholder:uppercase placeholder-gray-400
                focus:outline-none
                focus:ring-2 focus:ring-[#008B9E]/40
                transition
              "
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    {/* Password */}
                    <div className="relative w-full h-[50px] mb-6">
                        <input
                            type="password"
                            placeholder="PASSWORD"
                            required
                            className="
                w-full h-full rounded-full
                bg-white/70
                border border-[#008B9E]/30
                px-5
                text-gray-800
                placeholder:uppercase placeholder-gray-400
                focus:outline-none
                focus:ring-2 focus:ring-[#008B9E]/40
                transition
              "
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    {/* CREATE ACCOUNT BUTTON */}
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 320 }}
                        className="
              w-full h-[46px]
              rounded-full
              bg-[#008B9E]
              text-white
              font-semibold
              shadow-lg
              active:bg-[#006F7D]
              transition
            "
                    >
                        Create Account
                    </motion.button>
                </form>

                {/* LOGIN LINK */}
                <div className="text-center text-xs mt-5 text-gray-700 relative">
                    <p>
                        ALREADY HAVE AN ACCOUNT?{" "}
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); onLoginClick && onLoginClick(); }}
                            className="font-semibold text-[#008B9E] underline"
                        >
                            LOGIN
                        </a>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default SignupMobileGlass;

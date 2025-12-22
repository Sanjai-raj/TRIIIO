import React, { useState } from "react";
import { motion } from "framer-motion";
import { api, handleApiError } from "../src/api/client";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

interface LoginMobileGlassProps {
    onRegisterClick?: () => void;
}

const LoginMobileGlass: React.FC<LoginMobileGlassProps> = ({ onRegisterClick }) => {
    const [formData, setFormData] = useState({ phoneOrEmail: '', password: '', email: '' });
    const { login } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Ensure email is set for backend compatibility if it relies on 'email' field for the unified input
            const payload = {
                ...formData,
                email: formData.phoneOrEmail // We'll send phoneOrEmail as 'email' because some backends might expect 'email' field or we mirror the Login.tsx logic
            };

            // In Login.tsx: setFormData({ ...formData, phoneOrEmail: e.target.value, email: e.target.value })
            // So we should probably do the same here to match exactly.

            const { data } = await api.post('/auth/login', payload);
            login(data);
            showToast("Welcome back!", 'success');
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
                {/* subtle glass highlight */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />

                {/* LOGIN TITLE */}
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
                    Login
                </h1>

                <p className="text-xs text-center text-gray-500 mb-6 uppercase tracking-wide relative">
                    Login using your registered mobile number or email.
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Phone or Email */}
                    <div className="relative w-full h-[50px] mb-5">
                        <input
                            type="text"
                            placeholder="Phone number or Email"
                            required
                            className="
                w-full h-full rounded-full
                bg-white/70
                border border-[#008B9E]/30
                px-5 pr-12
                text-gray-800
                placeholder:uppercase placeholder-gray-400
                focus:outline-none
                focus:ring-2 focus:ring-[#008B9E]/40
                transition
              "
                            value={formData.phoneOrEmail}
                            onChange={e => setFormData({ ...formData, phoneOrEmail: e.target.value, email: e.target.value })}
                        />
                        <i className="bx bxs-user absolute right-5 top-1/2 -translate-y-1/2 text-[#008B9E] text-lg"></i>
                    </div>

                    {/* Password */}
                    <div className="relative w-full h-[50px] mb-4">
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            className="
                w-full h-full rounded-full
                bg-white/70
                border border-[#008B9E]/30
                px-5 pr-12
                text-gray-800
                placeholder:uppercase placeholder-gray-400
                focus:outline-none
                focus:ring-2 focus:ring-[#008B9E]/40
                transition
              "
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
                        <i className="bx bxs-lock-alt absolute right-5 top-1/2 -translate-y-1/2 text-[#008B9E] text-lg"></i>
                    </div>

                    {/* Remember / Forgot */}
                    <div className="flex justify-between items-center text-xs mb-5 text-[#008B9E] relative">
                        <label className="flex items-center gap-1">
                            <input type="checkbox" className="accent-[#008B9E]" />
                            Remember me
                        </label>
                        <a href="#" className="hover:underline">
                            Forgot?
                        </a>
                    </div>

                    {/* LOGIN BUTTON */}
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
              relative
            "
                    >
                        Log in
                    </motion.button>
                </form>

                {/* Register */}
                <div className="text-center text-xs mt-5 text-gray-700 relative">
                    <p>
                        NEW HERE?{" "}
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); onRegisterClick && onRegisterClick(); }}
                            className="font-semibold text-[#008B9E] underline"
                        >
                            CREATE ACCOUNT
                        </a>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginMobileGlass;

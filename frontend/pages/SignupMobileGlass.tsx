import React, { useState } from "react";
import { motion } from "framer-motion";
import { api, handleApiError } from "../src/api/client";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { User, Mail, Phone, Lock, ArrowRight } from "lucide-react";
// import BrandLogo from "../components/BrandLogo";

interface SignupMobileGlassProps {
    onLoginClick?: () => void;
}

const SignupMobileGlass: React.FC<SignupMobileGlassProps> = ({ onLoginClick }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
    const { login } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await api.post('/auth/signup', formData);
            login(data);
            showToast("Account created successfully!", 'success');
            if (data.user.role === 'owner') navigate('/admin/dashboard');
            else navigate('/');
        } catch (err: any) {
            showToast(handleApiError(err), 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#E6F6F8] to-white overflow-hidden relative">

            {/* 1. TOP BAR */}
            {/* 1. TOP BAR - (Removed global nav duplication) */}

            {/* 2. MAIN CONTENT AREA */}
            <div className="flex-grow flex items-start justify-center px-4 pt-4 pb-8 z-10">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="w-full max-w-[380px] rounded-[2rem] border border-white/60 bg-white/40 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,139,158,0.25)] px-7 py-8 relative overflow-hidden"
                >
                    {/* Header Text */}
                    <motion.div variants={itemVariants} className="text-center mb-6">
                        <h1 className="text-4xl font-black uppercase tracking-tighter text-[#008B9E] mb-2 font-sans">
                            Join Us
                        </h1>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.1em] leading-relaxed px-4">
                            Mobile number will be used for <br /> WhatsApp communication.
                        </p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <motion.div variants={itemVariants} className="relative group">
                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                                className="w-full h-12 rounded-2xl bg-white/80 border border-teal-100 px-6 pr-12 text-gray-800 placeholder:text-gray-400 placeholder:text-xs placeholder:uppercase focus:outline-none focus:ring-2 focus:ring-[#008B9E]/20 focus:border-[#008B9E] transition-all shadow-sm"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                            <User size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#008B9E]/60 transition-colors" />
                        </motion.div>

                        {/* Mobile */}
                        <motion.div variants={itemVariants} className="relative group">
                            <input
                                type="text"
                                placeholder="Mobile Number"
                                required
                                pattern="[0-9]{10}"
                                className="w-full h-12 rounded-2xl bg-white/80 border border-teal-100 px-6 pr-12 text-gray-800 placeholder:text-gray-400 placeholder:text-xs placeholder:uppercase focus:outline-none focus:ring-2 focus:ring-[#008B9E]/20 focus:border-[#008B9E] transition-all shadow-sm"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                            />
                            <Phone size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#008B9E]/60 transition-colors" />
                        </motion.div>

                        {/* Email */}
                        <motion.div variants={itemVariants} className="relative group">
                            <input
                                type="email"
                                placeholder="Email (Optional)"
                                className="w-full h-12 rounded-2xl bg-white/80 border border-teal-100 px-6 pr-12 text-gray-800 placeholder:text-gray-400 placeholder:text-xs placeholder:uppercase focus:outline-none focus:ring-2 focus:ring-[#008B9E]/20 focus:border-[#008B9E] transition-all shadow-sm"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                            <Mail size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#008B9E]/60 transition-colors" />
                        </motion.div>

                        {/* Password */}
                        <motion.div variants={itemVariants} className="relative group">
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                className="w-full h-12 rounded-2xl bg-white/80 border border-teal-100 px-6 pr-12 text-gray-800 placeholder:text-gray-400 placeholder:text-xs placeholder:uppercase focus:outline-none focus:ring-2 focus:ring-[#008B9E]/20 focus:border-[#008B9E] transition-all shadow-sm"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                            <Lock size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#008B9E]/60 transition-colors" />
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading}
                            className="w-full h-14 rounded-2xl bg-[#008B9E] text-white font-bold text-sm uppercase tracking-widest shadow-[0_12px_24px_-8px_rgba(0,139,158,0.5)] hover:bg-[#007a8a] transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            {isLoading ? "Creating Account..." : (
                                <>
                                    Create Account <ArrowRight size={18} />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Footer */}
                    <motion.div variants={itemVariants} className="text-center mt-6">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Already have an account?{" "}
                            <button
                                onClick={onLoginClick}
                                className="text-[#008B9E] underline decoration-2 underline-offset-4 ml-1 hover:text-[#006f7d]"
                            >
                                Login
                            </button>
                        </p>
                    </motion.div>
                </motion.div>
            </div>

            <div className="h-10" />
        </div>
    );
};

export default SignupMobileGlass;
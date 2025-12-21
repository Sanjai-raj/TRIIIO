import React from "react";
import { motion } from "framer-motion";

interface SignupMobileGlassProps {
    onLoginClick?: () => void;
}

const SignupMobileGlass: React.FC<SignupMobileGlassProps> = ({ onLoginClick }) => {
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

                <form onSubmit={(e) => e.preventDefault()}>
                    {/* Full Name */}
                    <div className="relative w-full h-[50px] mb-5">
                        <input
                            type="text"
                            placeholder="Full Name"
                            required
                            className="
                w-full h-full rounded-full
                bg-white/70
                border border-[#008B9E]/30
                px-5
                text-gray-800
                placeholder-gray-400
                focus:outline-none
                focus:ring-2 focus:ring-[#008B9E]/40
                transition
              "
                        />
                    </div>

                    {/* Email */}
                    <div className="relative w-full h-[50px] mb-5">
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            className="
                w-full h-full rounded-full
                bg-white/70
                border border-[#008B9E]/30
                px-5
                text-gray-800
                placeholder-gray-400
                focus:outline-none
                focus:ring-2 focus:ring-[#008B9E]/40
                transition
              "
                        />
                    </div>

                    {/* Password */}
                    <div className="relative w-full h-[50px] mb-6">
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            className="
                w-full h-full rounded-full
                bg-white/70
                border border-[#008B9E]/30
                px-5
                text-gray-800
                placeholder-gray-400
                focus:outline-none
                focus:ring-2 focus:ring-[#008B9E]/40
                transition
              "
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

                {/* ADMIN NOTE */}
                <div className="text-center text-[10px] mt-6 text-gray-500 relative uppercase tracking-wider">
                    Admin: owner@example.com / admin123
                </div>
            </motion.div>
        </div>
    );
};

export default SignupMobileGlass;

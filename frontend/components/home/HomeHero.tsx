import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HomeHero() {
    const navigate = useNavigate();

    const MARQUEE_TEXT = [
        "FREE SHIPPING ON ORDERS OVER $75",
        "YOUR NEW FAVORITE FIT IS HERE",
        "ESSENTIAL COMFORT FOR EVERYDAY",
        "FREE SHIPPING ON ORDERS OVER $75",
        "YOUR NEW FAVORITE FIT IS HERE",
        "ESSENTIAL COMFORT FOR EVERYDAY",
    ];

    return (
        <section className="relative w-full h-[90vh] overflow-hidden bg-[#f5f5f5]">

            {/* IMAGE */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url("/images/home-hero.png")`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "88% center", // PUSH IMAGE RIGHT
                    transform: "scale(0.96)",         // SLIGHT ZOOM-OUT
                }}
            />

            {/* BLEND MASK (NARROW + SMOOTH) */}
            <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#f5f5f5] via-[#f5f5f5]/60 to-transparent" />

            {/* CONTENT */}
            <div className="relative z-10 h-full flex items-center">
                <div className="pl-4 sm:pl-8 lg:pl-10 max-w-xl">

                    <h1 className="text-[#0f172a] font-extrabold text-5xl sm:text-6xl md:text-[84px] leading-[0.95] tracking-tight">
                        ESSENTIAL <br /> COMFORT
                    </h1>

                    <div className="w-16 h-[3px] bg-[#008B9E] mt-6 mb-6" />

                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500 font-medium mb-10">
                        UP TO 50% DISCOUNT
                    </p>

                    <button
                        onClick={() => navigate("/shop")}
                        className="inline-flex items-center gap-3 bg-[#008B9E] text-white px-10 py-4 text-sm font-bold tracking-wide hover:bg-[#007A8A] transition shadow-lg rounded-sm"
                    >
                        SHOP NOW
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </button>

                </div>
            </div>

            {/* MARQUEE */}
            <div className="absolute bottom-0 left-0 w-full bg-[#008B9E] text-white text-[11px] md:text-xs font-bold tracking-[0.15em] uppercase py-3 overflow-hidden flex z-20">
                <motion.div
                    className="flex whitespace-nowrap gap-8 md:gap-16 min-w-full"
                    animate={{ x: [0, -1000] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
                >
                    <div className="flex gap-8 md:gap-16 items-center">
                        {MARQUEE_TEXT.map((text, i) => (
                            <span key={i} className="flex items-center gap-8 md:gap-16">
                                {text}
                                <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>

        </section>
    );
}

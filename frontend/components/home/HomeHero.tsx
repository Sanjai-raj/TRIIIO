import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HomeHero() {
    const navigate = useNavigate();

    const MARQUEE_TEXT = [
        "FREE SHIPPING ON EVERY ORDER ALL OVER TAMILNADU",
        "YOUR NEW FAVORITE FIT IS HERE",
        "ESSENTIAL COMFORT FOR EVERYDAY",
        "FREE SHIPPING ON EVERY ORDER ALL OVER TAMILNADU",
        "YOUR NEW FAVORITE FIT IS HERE",
        "ESSENTIAL COMFORT FOR EVERYDAY",
    ];

    return (
        <section className="relative w-full h-[90vh] overflow-hidden bg-[#f5f5f5]">

            {/* CONTENT LAYOUT */}
            <div className="relative z-10 h-full flex flex-col md:flex-row">

                {/* LEFT: TEXT CONTENT (Raised higher) */}
                <div className="w-full md:w-[45%] h-full flex flex-col justify-end px-6 md:px-12 pb-32 md:pb-40">
                    <div className="max-w-xl text-left">
                        <h1 className="text-[#0f172a] font-extrabold text-5xl sm:text-6xl md:text-[84px] leading-[0.9] tracking-tight">
                            ESSENTIAL <br /> COMFORT
                        </h1>

                        <div className="w-16 h-[3px] bg-[#008B9E] mt-6 mb-8" />

                        <div className="flex flex-col sm:flex-row sm:items-center gap-8">
                            <p className="text-xs uppercase tracking-[0.25em] text-slate-500 font-medium">
                                UP TO 50% DISCOUNT
                            </p>

                            <button
                                onClick={() => navigate("/shop")}
                                className="inline-flex items-center gap-3 bg-[#008B9E] text-white px-8 py-3 text-xs font-bold tracking-wide hover:bg-[#007A8A] transition shadow-lg rounded-sm w-fit"
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
                </div>

                {/* RIGHT: IMAGE COVER (Blended) */}
                <div className="hidden md:block w-[55%] h-full relative">
                    <img
                        src="/images/hero-cover.png"
                        alt="Essential Comfort"
                        className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                    {/* Gradient Overlay for Blending */}
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#f5f5f5] w-full h-full" />
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

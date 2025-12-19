import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { homeHeroSlides } from "../../data/homeHeroSlides";
import { useNavigate } from "react-router-dom";

export default function HomeHeroSlider() {
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();



    const slide = homeHeroSlides[index];

    return (
        <section className="relative w-full overflow-hidden bg-gradient-to-r from-[#f5f5f5] via-[#f5f5f5] to-[#dcdcdc]">

            {/* HERO CONTENT */}
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center min-h-[calc(100vh-72px)]">

                    {/* LEFT TEXT */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`text-${index}`}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 30 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-xl space-y-6"
                        >
                            <h1 className="text-[#0f172a] font-extrabold text-[52px] md:text-[68px] leading-[1.05]">
                                {slide.title[0]} <br /> {slide.title[1]}
                            </h1>

                            {/* BLUE LINE */}
                            <div className="w-14 h-[2px] bg-[#008B9E]" />

                            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                                {slide.subtitle}
                            </p>

                            <button
                                onClick={() => navigate('/shop')}
                                className="inline-flex items-center gap-2 bg-[#008B9E] text-white px-7 py-3 text-sm font-semibold hover:bg-[#007A8A] transition"
                            >
                                {slide.cta}
                                <span>→</span>
                            </button>
                        </motion.div>
                    </AnimatePresence>

                    {/* RIGHT IMAGE (BLENDED) */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`image-${slide.image}`}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.6 }}
                            className="relative h-full flex items-end justify-end"
                        >
                            <div
                                className="w-full h-full bg-no-repeat bg-right bg-contain"
                                style={{
                                    backgroundImage: `url(${slide.image})`,
                                }}
                            />
                        </motion.div>
                    </AnimatePresence>

                </div>
            </div>

            {/* OFFER SCROLL BAR */}
            <div className="absolute bottom-0 left-0 w-full bg-[#008B9E] text-white text-xs tracking-widest uppercase py-2 overflow-hidden">
                <motion.div
                    animate={{ x: ["100%", "-100%"] }}
                    transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                    className="whitespace-nowrap"
                >
                    FREE SHIPPING ON ORDERS OVER $75 &nbsp; • &nbsp;
                    UP TO 50% OFF SELECTED ITEMS &nbsp; • &nbsp;
                    NEW ARRIVALS EVERY WEEK
                </motion.div>
            </div>
        </section>
    );
}

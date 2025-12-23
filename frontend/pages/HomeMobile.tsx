import React from 'react';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import PromotionalGrid from '../components/home/PromotionalGrid';
import FeaturedCarousel from '../components/featured/FeaturedCarousel';

const HomeMobile: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="font-sans text-gray-900 pb-20 bg-gray-50">
            {/* Hero Section */}
            <div className="p-4">
                <div className="w-full relative overflow-hidden rounded-[32px] shadow-xl bg-black">
                    {/* 1. Background Image Animation */}
                    <motion.img
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        src="/mobile-cover.png"
                        className="w-full h-[550px] object-cover"
                    />

                    {/* 2. Gradient Overlay - subtle dark bottom for text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* 3. Content Container */}
                    <div className="absolute inset-x-0 bottom-0 px-6 pb-4 pt-6 flex flex-col items-start">

                        {/* Text Animation - Scaled down size */}
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.7 }}
                            className="text-3xl font-black leading-tight text-white max-w-[200px] mb-2 font-sans tracking-tight"
                        >
                            Youth dress style now
                        </motion.h1>

                        <motion.p
                            transition={{ delay: 0.6, duration: 0.7 }}
                            className="text-gray-200 text-sm font-medium font-sans max-w-[240px] mb-2 opacity-90"
                        >
                            There are many clothes with designs that are suitable for today's young people.
                        </motion.p>

                        {/* Button Animation */}
                        <div className="w-full flex justify-end">
                            <motion.button
                                onClick={() => navigate('/shop')}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.8, type: "spring", stiffness: 150 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-[#008B9E] text-white px-10 py-3.5 rounded-xl font-bold text-sm shadow-lg hover:bg-[#006D7C] transition-colors"
                            >
                                Continue
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Standard Grids */}
            <PromotionalGrid />
            <FeaturedCarousel />
        </div>
    );
}

export default HomeMobile;

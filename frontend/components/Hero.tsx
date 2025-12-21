import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <div className="relative bg-[#FAFAFA] min-h-screen flex items-center overflow-hidden">
            {/* Background Gradient - Subtle */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-50 pointer-events-none" />

            <div className="container mx-auto px-6 md:px-12 relative z-10 w-full">
                <div className="flex flex-col items-center justify-center h-full text-center">

                    {/* Content */}
                    <div className="w-full max-w-4xl flex flex-col items-center justify-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-forwards">

                        {/* Subtext */}
                        <p className="text-gray-500 font-medium tracking-[0.2em] text-xs md:text-sm uppercase translate-y-2 opacity-0 animate-[fade-in_1s_ease-out_0.2s_forwards]">
                            Up to 50% Discount
                        </p>

                        {/* Headline */}
                        <h1 className="text-[#0F172A] font-sans font-black text-6xl md:text-7xl lg:text-[7rem] leading-[0.95] tracking-tight">
                            <span className="block">ESSENTIAL</span>
                            <span className="block">COMFORT</span>
                        </h1>

                        {/* CTA Button */}
                        <div className="pt-4 opacity-0 animate-[fade-in_1s_ease-out_0.6s_forwards]">
                            <button
                                onClick={() => navigate('/shop')}
                                className="group bg-[#008B9E] text-white px-8 py-4 flex items-center gap-4 transition-all duration-300 hover:bg-[#007282] hover:shadow-lg hover:-translate-y-0.5"
                            >
                                <span className="font-bold tracking-wide text-sm">SHOP NOW</span>
                                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default Hero;

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
                <div className="flex flex-col md:flex-row items-center h-full">

                    {/* Left Content (45%) */}
                    <div className="w-full md:w-[45%] flex flex-col justify-center space-y-8 md:pr-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-forwards">

                        {/* Subtext */}
                        <p className="text-gray-500 font-medium tracking-[0.2em] text-xs md:text-sm uppercase translate-y-2 opacity-0 animate-[fade-in_1s_ease-out_0.2s_forwards]">
                            Up to 50% Discount
                        </p>

                        {/* Headline */}
                        <h1 className="text-[#0F172A] font-sans font-black text-6xl md:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tight">
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

                    {/* Right Image (55%) */}
                    <div className="w-full md:w-[55%] h-full flex items-center justify-end relative mt-12 md:mt-0 opacity-0 animate-[fade-in_1.2s_ease-out_0.4s_forwards]">
                        <div className="relative w-full aspect-[4/5] max-w-[650px] md:translate-x-8">
                            {/* 
                  Using the user uploaded image /hero_cover_new.png
                  Ensuring it doesn't touch edges (padding inside container handles horizontal, 
                  but we'll ensure object-contain/cover looks good) 
               */}
                            <img
                                src="/hero_cover_new.png"
                                alt="Modern Fashion Model"
                                className="w-full h-full object-contain object-center drop-shadow-2xl"
                                // Increased contrast slightly for pop
                                style={{ filter: 'contrast(1.05)' }}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Hero;

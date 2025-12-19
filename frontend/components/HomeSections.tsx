import React from 'react';
import AnimatedButton from './AnimatedButton';
import { useNavigate } from 'react-router-dom';
import { useSectionAnalytics } from '../hooks/useSectionAnalytics';

export default function HomeSections() {
    return (
        <main className="w-full">
            <HeroStatement />
            <CasualSection />
            <ModernSection />
        </main>
    );
}

function HeroStatement() {
    const navigate = useNavigate();
    const ref = useSectionAnalytics("Hero Statement Section");
    return (
        <section ref={ref} className="min-h-screen flex items-center bg-[#f8f6f2]">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

                {/* LEFT TEXT */}
                <div>
                    <h1 className="font-serif text-5xl md:text-6xl text-gray-900 leading-tight">
                        YOUR NEXT
                        <br />
                        LOOK AWAITS
                    </h1>

                    <p className="mt-6 text-gray-600 max-w-md">
                        Discover shirts that feel effortless, confident, and modern.
                        Designed for everyday comfort and timeless style.
                    </p>

                    <AnimatedButton onClick={() => navigate('/shop')} className="mt-8 border border-gray-900 px-8 py-3 text-sm tracking-wide bg-transparent text-gray-900 hover:text-white transition">
                        SHOP SHIRTS
                    </AnimatedButton>
                </div>

                {/* RIGHT IMAGE */}
                <div className="flex justify-center">
                    <img
                        src="/hero_cover.png"
                        alt="Modern shirt style"
                        className="max-h-[600px] object-contain"
                    />
                </div>

            </div>
        </section>
    );
}

function CasualSection() {
    const navigate = useNavigate();
    const ref = useSectionAnalytics("Casual Collection Section");
    return (
        <section ref={ref} className="min-h-screen flex items-center bg-white">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

                {/* IMAGE */}
                <div className="flex justify-center order-2 md:order-1">
                    <img
                        src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
                        alt="Casual shirts"
                        className="max-h-[550px] object-contain"
                    />
                </div>

                {/* TEXT */}
                <div className="order-1 md:order-2">
                    <h2 className="font-serif text-4xl md:text-5xl text-gray-900">
                        Effortless Casuals
                    </h2>

                    <p className="mt-6 text-gray-600 max-w-md">
                        Relaxed fits, breathable fabrics, and modern patterns.
                        Casual shirts designed to move with you.
                    </p>

                    <AnimatedButton onClick={() => navigate('/shop?category=casual')} className="mt-8 bg-teal-600 text-white px-8 py-3 text-sm hover:bg-teal-700 transition">
                        EXPLORE CASUALS
                    </AnimatedButton>
                </div>

            </div>
        </section>
    );
}

function ModernSection() {
    const navigate = useNavigate();
    const ref = useSectionAnalytics("Modern Collection Section");
    return (
        <section ref={ref} className="min-h-screen flex items-center bg-[#f4f5f7]">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

                {/* TEXT */}
                <div>
                    <h2 className="font-serif text-4xl md:text-5xl text-gray-900">
                        Modern. Smart. Versatile.
                    </h2>

                    <p className="mt-6 text-gray-600 max-w-md">
                        Shirts crafted to transition seamlessly from work to weekend.
                        Minimal design with maximum impact.
                    </p>

                    <AnimatedButton onClick={() => navigate('/shop?category=formal')} className="mt-8 border border-gray-900 px-8 py-3 text-sm bg-transparent text-gray-900 hover:text-white transition">
                        VIEW COLLECTION
                    </AnimatedButton>
                </div>

                {/* IMAGE */}
                <div className="flex justify-center">
                    <img
                        src="https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80"
                        alt="Modern shirts"
                        className="max-h-[550px] object-contain"
                    />
                </div>

            </div>
        </section>
    );
}

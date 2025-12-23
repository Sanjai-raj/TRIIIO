import React, { useEffect, useState } from "react";
import { getFeaturedProducts } from "../../services/product.service";
import { useCarousel } from "./useCarousel";
import FeaturedCard from "./FeaturedCard";
import AnimatedButton from "../AnimatedButton";
import { useNavigate } from "react-router-dom";
import { Product } from "../../types";

const CARD_WIDTH = 280;

interface FeaturedCarouselProps {
    title?: string;
    subtitle?: string;
}

export default function FeaturedCarousel({
    title = "Featured Collection",
    subtitle = "Effortless Style, Everyday Comfort"
}: FeaturedCarouselProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getFeaturedProducts().then(setProducts);
    }, []);

    const {
        activeIndex,
        setActiveIndex,
        translateX,
        onTouchStart,
        onTouchEnd,
    } = useCarousel(products.length, CARD_WIDTH);

    if (!products.length) return null;

    return (
        <div className="py-6 sm:py-14 lg:py-20 overflow-hidden bg-white selection:bg-[#008B9E] selection:text-white">
            <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-gray-900 uppercase leading-none font-sans mb-3">
                {title.split(' ').slice(0, -1).join(' ')} <span className="text-[#008B9E]">{title.split(' ').slice(-1)}</span>
            </h2>
            <p className="text-center mt-2 text-sm uppercase tracking-[0.3em] text-slate-500 mb-12">
                {subtitle}
            </p>

            <div className="relative h-[450px] flex items-center">
                {/* Desktop View (Existing implementation) */}
                <div
                    className="hidden md:flex absolute left-0 transition-transform duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)]"
                    style={{ transform: translateX }}
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                >
                    {products.map((product, index) => (
                        <FeaturedCard
                            key={`desktop-${product._id}`}
                            product={product}
                            isActive={index === activeIndex}
                            onHover={() => setActiveIndex(index)}
                        />
                    ))}
                </div>

                {/* Mobile View (Smooth Native Scroll) */}
                <div
                    className="md:hidden flex overflow-x-auto snap-x snap-mandatory no-scrollbar w-full h-full items-center"
                    style={{
                        scrollBehavior: 'smooth',
                        paddingLeft: 'calc(50vw - 156px)', // Center first item: 50% screen - half item width (312/2)
                        paddingRight: 'calc(50vw - 156px)' // Center last item
                    }}
                    onScroll={(e) => {
                        const container = e.currentTarget;
                        const cardWidth = 312; // 280 width + 32 margin (mx-4)

                        // Calculate the center point of the visible container + scroll offset
                        // We want to know which item center is closest to the container center
                        // itemCenter(i) = paddingLeft + i * cardWidth + cardWidth/2
                        // activeIndex = round((scrollLeft) / cardWidth) roughly?

                        // Let's use simple math:
                        // scrollLeft 0 => item 0 is centered.
                        // scrollLeft 312 => item 1 is centered.
                        const newIndex = Math.round(container.scrollLeft / cardWidth);

                        if (newIndex >= 0 && newIndex < products.length && newIndex !== activeIndex) {
                            setActiveIndex(newIndex);
                        }
                    }}
                >
                    {products.map((product, index) => (
                        <div key={`mobile-${product._id}`} className="snap-center shrink-0 flex items-center justify-center">
                            {/* FeaturedCard has mx-4 (16px * 2 = 32px horizontal margin). Width 280. Total space 312. */}
                            <FeaturedCard
                                product={product}
                                isActive={index === activeIndex}
                                onHover={() => setActiveIndex(index)}
                            />
                        </div>
                    ))}
                </div>
                {/* We need initial padding-left to center first item.
                    Container width = 100vw. Center = 50vw.
                    Item width = 280 + 32 (margin) = 312. Half item = 156.
                    So we need padding-left = 50vw - 156px.
                */}
                <style>{`
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .no-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>
            </div>

            <div className="flex justify-center mt-6 md:mt-12 px-6 md:px-0">
                <AnimatedButton onClick={() => navigate('/shop')} className="w-full md:w-64 h-14 text-lg">
                    View All Items
                </AnimatedButton>
            </div>
        </div>
    );
}

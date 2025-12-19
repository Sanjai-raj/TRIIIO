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
        <div className="py-10 sm:py-14 lg:py-20 overflow-hidden bg-white selection:bg-[#008B9E] selection:text-white">
            <h2 className="text-center text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                {title}
            </h2>
            <p className="text-center mt-2 text-sm uppercase tracking-[0.3em] text-slate-500 mb-12">
                {subtitle}
            </p>

            <div className="relative h-[450px] flex items-center">
                <div
                    className="flex absolute left-0 transition-transform duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)]"
                    style={{ transform: translateX }}
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                >
                    {products.map((product, index) => (
                        <FeaturedCard
                            key={product._id}
                            product={product}
                            isActive={index === activeIndex}
                            onHover={() => setActiveIndex(index)}
                        />
                    ))}
                </div>
            </div>

            <div className="flex justify-center mt-12 px-6 md:px-0">
                <AnimatedButton onClick={() => navigate('/shop')} className="w-full md:w-64 h-14 text-lg">
                    View All Items
                </AnimatedButton>
            </div>
        </div>
    );
}

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { PLACEHOLDER_IMG } from '../../src/constants';
import { useCurrency } from '../../context/CurrencyContext';

interface RelatedProductsProps {
    items: Product[];
}

const RelatedProducts = ({ items }: RelatedProductsProps) => {
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();

    if (!items || items.length === 0) return null;

    return (
        /* Reduced mt-16 to mt-4 and pt-12 to pt-4 to remove the large gap marked in blue */
        <section className="mt-4 lg:mt-6 border-t border-gray-100 pt-4 max-w-[1440px] mx-auto">
            <div className="flex items-center justify-between mb-8 px-4 lg:px-0">
                {/* Increased font size from text-[11px] to text-sm/text-base */}
                <h2 className="text-sm lg:text-base font-black uppercase tracking-[0.3em] text-gray-900">
                    You May Also Like
                </h2>
                <Link
                    to="/shop"
                    /* Increased font size from text-[10px] to text-xs/text-sm */
                    className="text-xs lg:text-sm font-bold uppercase tracking-widest text-[#008B9E] border-b border-[#008B9E] pb-1 hover:opacity-70 transition-opacity"
                >
                    View All
                </Link>
            </div>

            {/* Grid: 2 columns on mobile, 3 on md, 4 on lg */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-8 px-4 lg:px-0">
                {items.map((item) => (
                    <div key={item._id} className="group cursor-pointer" onClick={() => navigate(`/product/${item._id}`)}>
                        {/* Image Container */}
                        <div className="relative aspect-[3/4] overflow-hidden bg-[#F9F9F9] rounded-sm">
                            <img
                                src={item.images?.[0]?.url || PLACEHOLDER_IMG}
                                alt={item.name}
                                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                            />

                            {/* Quick Add / View Overlay - Light tint on hover */}
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Quick View Button - Flush to bottom edge */}
                            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                                <button
                                    className="w-full py-3 text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm bg-white text-gray-900 hover:bg-gray-900 hover:text-white"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevents navigating to product page when clicking button
                                    }}
                                >
                                    Quick View
                                </button>
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="mt-4 space-y-1.5 text-center lg:text-left">
                            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-1">
                                <h3 className="text-[11px] lg:text-sm font-bold text-gray-900 uppercase tracking-tight truncate">
                                    {item.name}
                                </h3>
                                <p className="text-sm font-medium text-[#008B9E]">
                                    {formatPrice(item.price)}
                                </p>
                            </div>
                            <p className="text-[9px] lg:text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                                {item.category || 'Casual'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default RelatedProducts;

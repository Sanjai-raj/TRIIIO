import React from 'react';
import { Product } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
// @ts-ignore
import { useNavigate } from 'react-router-dom';
import { PLACEHOLDER_IMG } from '../../constants';
// @ts-ignore
import { LazyImage } from '../LazyImage';
import { getImageUrl } from '../../utils/imageUtils';

interface RelatedProductsProps {
    items: Product[];
}

export default function RelatedProducts({ items }: RelatedProductsProps) {
    const { formatPrice } = useCurrency();
    const navigate = useNavigate();

    if (!items || items.length === 0) return null;

    return (
        <div className="px-4 mt-8 mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 text-gray-900 border-b border-gray-100 pb-2">
                You May Also Like
            </h2>

            <div className="grid grid-cols-2 gap-3">
                {items.map((p) => (
                    <div
                        key={p._id}
                        className="group border border-gray-100 rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => {
                            window.scrollTo(0, 0);
                            navigate(`/product/${p._id}`);
                        }}
                    >
                        <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                            <img
                                src={getImageUrl(p)}
                                alt={p.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                            />
                        </div>

                        <div className="p-2 text-center bg-white">
                            <p className="text-xs truncate text-gray-700 font-medium mb-1">{p.name}</p>
                            <p className="text-sm font-bold text-[#008B9E]">
                                {formatPrice(p.price)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

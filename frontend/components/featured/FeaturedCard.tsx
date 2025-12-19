import React from 'react';
import { Product } from '../../types';
import { PLACEHOLDER_IMG } from '../../constants';
// @ts-ignore
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../../context/CurrencyContext';
import { getImageUrl } from '../../utils/imageUtils';



interface FeaturedCardProps {
    product: Product;
    isActive: boolean;
    onHover: () => void;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ product, isActive, onHover }) => {
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();

    return (
        <div
            onMouseEnter={onHover}
            onClick={() => navigate(`/product/${product._id}`)}
            className={`
        relative mx-4 shrink-0 cursor-pointer 
        transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)]
        ${isActive ? 'scale-110 z-20' : 'scale-95 z-10 opacity-70 hover:opacity-100'}
        hover:-translate-y-2
      `}
            style={{ width: 280 }}
        >
            <div className={`
        bg-white rounded-2xl shadow-xl overflow-hidden h-[380px]
        transition-shadow duration-500 ease-out
        ${isActive ? 'shadow-2xl' : 'shadow-xl'}
      `}>
                {(() => {
                    const imageUrl = getImageUrl(product);
                    return (
                        <img
                            src={imageUrl}
                            alt={product.name}
                            onError={(e) => {
                                console.error("IMAGE FAILED:", imageUrl);
                                e.currentTarget.src = PLACEHOLDER_IMG;
                            }}
                            className="w-full h-full object-cover"
                        />
                    );
                })()}

                {isActive && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-6 py-2 rounded-full shadow-md min-w-[max-content] text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                        <p className="text-[#008B9E] font-bold text-center">
                            {formatPrice(product.price)}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeaturedCard;

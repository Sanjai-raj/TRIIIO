import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { FaHeart, FaRegHeart, FaEye, FaShoppingCart } from 'react-icons/fa';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import toast from 'react-hot-toast';
import { PLACEHOLDER_IMG } from '../src/constants';
import { getImageUrl } from '../utils/imageUtils';



interface ProductCardProps {
    product: Product;
}

const iconAnim = "transition-transform duration-200 ease-out hover:scale-110 active:scale-95";

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { formatPrice } = useCurrency();
    const [loading, setLoading] = useState(false);
    const linkTo = `/product/${product._id}`;
    const isWishlisted = isInWishlist(product._id);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setLoading(true);
        // Simulate minor delay
        await new Promise(resolve => setTimeout(resolve, 500));
        addToCart(product, 1, product.variants?.[0]?.size || "M", product.colors?.[0] || "Default");
        toast.success("Added to cart");
        setLoading(false);
    };

    const handleWishlistClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
    };

    const imageUrl = getImageUrl(product);

    return (
        <div className="group relative bg-white rounded-lg border border-gray-100 overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
            {/* Image */}
            <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
                <Link to={linkTo}>
                    <img
                        src={imageUrl}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                            console.error("IMAGE FAILED:", imageUrl);
                            e.currentTarget.src = PLACEHOLDER_IMG;
                        }}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </Link>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none z-10">
                    {product.discount && product.discount > 0 && (
                        <span className="bg-[#008B9E] text-white text-[15px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
                            Sale
                        </span>
                    )}
                    {product.stock === 0 && (
                        <span className="bg-gray-800 text-white text-[15px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
                            Out
                        </span>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistClick}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 transition-colors z-20 shadow-sm"
                >
                    {isWishlisted ? <FaHeart size={14} className="text-red-500" /> : <FaRegHeart size={14} />}
                </button>
            </div>

            {/* Content */}
            <div className="p-3 text-center">
                <p className="text-[15px] text-gray-400 uppercase tracking-widest mb-1 truncate">
                    {product.category}
                </p>

                <Link to={linkTo}>
                    <h3 className="text-[15px] font-bold text-gray-900 truncate mb-1 hover:text-[#008B9E] transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center justify-center gap-2 mb-3">
                    {product.discount ? (
                        <>
                            <span className="text-[15px] text-gray-400 line-through">{formatPrice(product.price * (1 + product.discount / 100))}</span>
                            <span className="text-[15px] font-bold text-[#008B9E]">{formatPrice(product.price)}</span>
                        </>
                    ) : (
                        <span className="text-[15px] font-bold text-[#008B9E]">{formatPrice(product.price)}</span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-gray-50 pt-2 text-[15px] font-bold uppercase tracking-wider text-[#008B9E]">
                    <Link to={linkTo} className="hover:text-[#006D7C] transition-all duration-200 hover:scale-[1.02] active:scale-[0.97] px-2">
                        View
                    </Link>
                    <button
                        onClick={handleAddToCart}
                        disabled={loading || product.stock === 0}
                        className="hover:text-[#006D7C] transition-all duration-200 hover:scale-[1.02] active:scale-[0.97] px-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                        {loading && <Loader2 size={8} className="animate-spin" />}
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

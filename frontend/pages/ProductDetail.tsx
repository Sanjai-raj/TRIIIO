import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Product, Review } from '../types';
import { api } from '../src/api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { PLACEHOLDER_IMG } from '../src/constants';
import { FaStar, FaRuler, FaTimes, FaCheck, FaHeart, FaRegHeart, FaEye, FaShoppingCart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import ShareButton from '../components/ShareButton';
import ProductCard from '../components/ProductCard';
import RelatedProducts from '../components/product/RelatedProducts';
import ProductGallery from '../components/product/ProductGallery';
import SizeGuideSheet from '../components/product/SizeGuideSheet';
import { trackEvent } from '../utils/analytics';

const MotionDiv = motion.div as any;

const primaryButton = "relative overflow-hidden px-10 py-4 text-sm font-semibold tracking-widest uppercase rounded-full transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[#00C4D6]/50 shadow-md";

const getDeliveryRange = () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() + 5);
    const end = new Date(today);
    end.setDate(today.getDate() + 7);

    const format = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    return `${format(start)} – ${format(end)}`;
};

const ProductDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { formatPrice } = useCurrency();
    const { showToast } = useToast();

    const [product, setProduct] = useState<Product | null>(null);
    const [recommended, setRecommended] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    // const [selectedImg, setSelectedImg] = useState(''); // Removed, handled by Gallery
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [showSizeChart, setShowSizeChart] = useState(false);
    const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

    // Accordion State
    // No state needed for native details element if we just want simple toggle.

    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);

        setSize('');
        setColor('');
        setQuantity(1);

        api.get(`/products/${id}`)
            .then(res => {
                setProduct(res.data);
                // Initialize default color if available
                if (res.data.colors && res.data.colors.length > 0) {
                    setColor(res.data.colors[0]);
                }

                if (res.data.category) {
                    fetchRecommended(res.data.category, res.data._id);
                }
            })
            .catch(() => navigate('/shop'))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    const fetchRecommended = async (category: string, currentId: string) => {
        try {
            const res = await api.get(`/products?category=${category}&limit=4`);
            const all = res.data.products || res.data;
            setRecommended(all.filter((p: Product) => p._id !== currentId).slice(0, 3));
        } catch (e) { console.error(e); }
    };

    const validateSelection = () => {
        if (!product) return false;
        if (!size || !color) {
            showToast("Please select size and color", 'error');
            return false;
        }
        if (product.variants) {
            const variant = product.variants.find(v => v.size === size);
            if (variant && variant.stock < quantity) {
                showToast(`Only ${variant.stock} left in size ${size}`, 'error');
                return false;
            }
        } else if (product.stock < quantity) {
            showToast("Not enough stock available", 'error');
            return false;
        }
        return true;
    };

    const handleAddToCart = async () => {
        if (validateSelection()) {
            trackEvent("add_to_cart", product);
            setAddingToCart(true);
            await new Promise(resolve => setTimeout(resolve, 600)); // UX delay
            addToCart(product!, quantity, size, color);
            showToast("Added to cart!", 'success');
            setAddingToCart(false);
        }
    };

    const handleBuyNow = () => {
        if (validateSelection()) {
            trackEvent("buy_now", product);
            addToCart(product!, quantity, size, color);
            navigate('/checkout');
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) { showToast("Please login to review", 'info'); return; }
        if (!product) return;

        setSubmittingReview(true);
        try {
            const res = await api.post(`/products/${product._id}/reviews`, {
                rating: reviewRating,
                comment: reviewComment
            });
            setProduct(res.data);
            setReviewComment('');
            showToast("Review submitted!", 'success');
        } catch (e) {
            showToast("Failed to submit review", 'error');
        } finally {
            setSubmittingReview(false);
        }
    };



    if (loading) return <div className="min-h-screen bg-white" />; // Let global transition handle load visual

    if (!product) return null;

    let currentStock = product.stock;
    if (size && product.variants) {
        const v = product.variants.find(v => v.size === size);
        if (v) currentStock = v.stock;
    }

    return (
        <MotionDiv
            className="container mx-auto px-4 pb-6 lg:pb-12 bg-white min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Desktop Breadcrumb */}
            <div className="hidden lg:block pt-4 text-[10px] uppercase tracking-widest text-gray-500 mb-3">
                <Link to="/" className="hover:text-[#008B9E]">Home</Link> /
                <Link to="/shop" className="hover:text-[#008B9E] mx-1">Shop</Link> /
                <span className="text-gray-900 font-bold ml-1">{product.name}</span>
            </div>

            {/* Layout Wrapper */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-16">

                {/* IMAGE SECTION */}
                <div className="lg:hidden px-4 pt-2 mb-2">
                    <ProductGallery
                        variants={product.colorVariants || []}
                        selectedColor={color}
                        images={product.images}
                    />
                </div>
                {/* Desktop Image Grid (Hidden on Mobile) */}
                <div className="hidden lg:block aspect-[3/4] rounded-sm bg-gray-50 relative overflow-hidden">
                    <ProductGallery
                        variants={product.colorVariants || []}
                        selectedColor={color}
                        images={product.images}
                    />
                </div>

                {/* INFO SECTION */}
                <div className="px-4 lg:px-0 pt-0 lg:pt-0">
                    <h1 className="text-base lg:text-3xl font-semibold lg:font-black text-gray-900 leading-tight">
                        {product.name}
                    </h1>

                    <div className="mt-1 flex items-center gap-2">
                        <span className="text-lg lg:text-2xl font-bold text-[#008B9E]">
                            {formatPrice(product.price)}
                        </span>
                        {product.discount ? (
                            <>
                                <span className="text-xs lg:text-lg line-through text-gray-400">
                                    {formatPrice(product.price * (1 + product.discount / 100))}
                                </span>
                                <span className="text-xs lg:text-sm text-green-700 font-semibold bg-green-100 px-1.5 py-0.5 rounded">
                                    {product.discount}% OFF
                                </span>
                            </>
                        ) : null}
                    </div>

                    <p className="mt-0.5 text-xs text-gray-500">
                        {currentStock === 0 ? (
                            <span className="text-red-500 font-bold">Out of Stock</span>
                        ) : (
                            <span>Only {currentStock} left · Free delivery</span>
                        )}
                    </p>

                    {/* OPTIONS */}
                    <div className="mt-3 lg:mt-6 border-t border-gray-100 pt-3 lg:pt-4">
                        {/* Size */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-sm font-medium">Size</p>
                                <button onClick={() => setShowSizeChart(true)} className="text-xs text-[#008B9E] underline">Size Guide</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map(s => {
                                    let isAvailable = true;
                                    if (product.variants) {
                                        const v = product.variants.find(v => v.size === s);
                                        if (!v || v.stock === 0) isAvailable = false;
                                    }
                                    return (
                                        <button
                                            key={s}
                                            onClick={() => isAvailable && setSize(s)}
                                            disabled={!isAvailable}
                                            className={`
                                                px-3 py-1 border rounded text-sm font-medium min-w-[2.5rem] transition-all
                                                ${size === s ? 'border-[#008B9E] text-[#008B9E] ring-1 ring-[#008B9E]' : 'border-gray-200 text-gray-700 hover:border-gray-300'}
                                                ${!isAvailable ? 'opacity-40 cursor-not-allowed bg-gray-50' : ''}
                                            `}
                                        >
                                            {s}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Color + Quantity Row */}
                        <div className="mt-3 grid grid-cols-2 gap-3 items-end">
                            {/* Color */}
                            {product.colors && product.colors.length > 0 ? (
                                <div>
                                    <p className="text-sm font-medium mb-1">Color</p>
                                    <div className="flex gap-2">
                                        {product.colors.map(c => (
                                            <button
                                                key={c}
                                                onClick={() => setColor(c)}
                                                className={`w-6 h-6 rounded-full border shadow-sm ${color === c ? 'ring-2 ring-offset-1 ring-[#008B9E]' : 'border-gray-200'}`}
                                                style={{ backgroundColor: c.toLowerCase() }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                // Spacer if no colors, to keep quantity alignment
                                <div />
                            )}

                            {/* Quantity */}
                            <div>
                                <p className="text-sm font-medium mb-1">Quantity</p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50 text-lg"
                                    >
                                        −
                                    </button>
                                    <span className="w-6 text-center font-medium text-sm">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                                        className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50 text-lg"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={addingToCart || currentStock === 0}
                                className="flex-1 border border-[#008B9E] text-[#008B9E] py-2 rounded text-sm font-semibold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-50 transition-colors"
                            >
                                {addingToCart ? <Loader2 className="animate-spin w-4 h-4 mx-auto" /> : 'Add to Cart'}
                            </button>

                            <button
                                onClick={handleBuyNow}
                                disabled={currentStock === 0}
                                className="flex-1 bg-[#008B9E] text-white py-2 rounded text-sm font-semibold uppercase tracking-wide hover:bg-[#007A8A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>

                    {/* COLLAPSIBLE DETAILS */}
                    <div className="mt-8 divide-y divide-gray-100 border-t border-gray-100">
                        <details className="py-4 group">
                            <summary className="text-sm font-medium flex justify-between items-center cursor-pointer list-none text-gray-900 select-none">
                                Description & Fit
                                <span className="group-open:rotate-180 transition-transform duration-300">▼</span>
                            </summary>
                            <div className="text-sm text-gray-600 mt-2 leading-relaxed animate-fadeIn">
                                <p>{product.description}</p>
                            </div>
                        </details>

                        <details className="py-4 group">
                            <summary className="text-sm font-medium flex justify-between items-center cursor-pointer list-none text-gray-900 select-none">
                                Shipping Information
                                <span className="group-open:rotate-180 transition-transform duration-300">▼</span>
                            </summary>
                            <div className="text-sm text-gray-600 mt-2 leading-relaxed animate-fadeIn">
                                <p>Delivered in 3–4 working days.</p>
                                <p className="mt-1">Free shipping on orders over ₹999.</p>
                            </div>
                        </details>

                        <details className="py-4 group">
                            <summary className="text-sm font-medium flex justify-between items-center cursor-pointer list-none text-gray-900 select-none">
                                Reviews ({product.reviews?.length || 0})
                                <span className="group-open:rotate-180 transition-transform duration-300">▼</span>
                            </summary>
                            <div className="text-sm text-gray-600 mt-2 leading-relaxed animate-fadeIn">
                                {product.reviews?.slice(0, 3).map((r, i) => (
                                    <div key={i} className="mb-3 border-b border-gray-50 pb-2 last:border-0 layer">
                                        <div className="flex justify-between">
                                            <span className="font-bold text-xs">{r.user}</span>
                                            <span className="text-[10px] text-gray-400">{new Date(r.date).toLocaleDateString()}</span>
                                        </div>
                                        <p className="italic text-xs mt-1">"{r.comment}"</p>
                                    </div>
                                ))}
                                {(!product.reviews || product.reviews.length === 0) && <p className="italic text-gray-400">No reviews yet.</p>}
                            </div>
                        </details>
                    </div>
                </div>
            </div>

            {/* RELATED PRODUCTS */}
            {recommended.length > 0 && <RelatedProducts items={recommended} />}

            <SizeGuideSheet
                open={showSizeChart}
                onClose={() => setShowSizeChart(false)}
            />
        </MotionDiv>
    );
};

export default ProductDetail;
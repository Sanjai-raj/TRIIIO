import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { PLACEHOLDER_IMG } from '../src/constants';
import { getImageUrl } from '../utils/imageUtils';
import { api } from '../src/api/client';
import { Product } from '../types';
import BrandLogo from './BrandLogo';
import { AnimatePresence, motion } from 'framer-motion';
import {
    FaShoppingCart, FaBars, FaTimes, FaSearch, FaHeart
} from 'react-icons/fa';
import MobileDrawer from './MobileDrawer';

const MotionDiv = motion.div as any;

const iconAnim = "transition-transform duration-200 ease-out hover:scale-110 active:scale-95";

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const { itemCount, items, cartTotal } = useCart();
    const { wishlist } = useWishlist();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    // Prevent background scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isMenuOpen]);


    // Live Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
        setSearchQuery('');
    }, [location]);

    // Click outside to close search
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Live Search Logic
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.length > 1) {
                try {
                    const res = await api.get(`/products?search=${searchQuery}&limit=5`);
                    setSearchResults(res.data.products || res.data);
                    setIsSearchOpen(true);
                } catch (e) {
                    console.error(e);
                }
            } else {
                setSearchResults([]);
                setIsSearchOpen(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const navClasses = 'sticky top-0 z-[1000] bg-white border-b border-gray-100 shadow-sm';

    return (
        <>
            <nav className={navClasses}>
                <div className="container mx-auto px-6 h-20 grid grid-cols-3 items-center relative">

                    {/* LEFT: Nav & Search Toggle */}
                    <div className="flex items-center justify-start gap-6">
                        <button className="md:hidden text-[#008B9E] focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                        </button>

                        <div className="hidden md:flex items-center gap-6">
                            <Link to="/" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#008B9E] transition-colors duration-300">Home</Link>
                            <Link to="/shop" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#008B9E] transition-colors duration-300">Shop</Link>
                            <Link to="/shop?category=Casual" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#008B9E] transition-colors duration-300">Casual</Link>
                        </div>
                    </div>

                    {/* CENTER: Logo */}
                    <div className="flex justify-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <BrandLogo className="h-8 w-auto" />
                            <span className="text-2xl font-serif font-black tracking-tighter text-[#008B9E]">TRIIIO</span>
                        </Link>
                    </div>

                    {/* RIGHT: Actions */}
                    <div className="flex items-center justify-end gap-6">

                        {/* Search Input */}
                        <div className="relative hidden md:block" ref={searchRef}>
                            <div className="flex items-center border-b border-transparent hover:border-gray-200 focus-within:border-[#008B9E] transition-colors pb-1">
                                <FaSearch size={14} className="text-gray-400 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent focus:outline-none text-xs font-bold uppercase tracking-widest w-24 focus:w-48 transition-all duration-300"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => searchQuery.length > 1 && setIsSearchOpen(true)}
                                />
                            </div>

                            {/* Live Search Results Dropdown */}
                            <AnimatePresence>
                                {isSearchOpen && (
                                    <MotionDiv
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full right-0 mt-4 w-80 bg-white shadow-xl border border-gray-100 rounded-sm overflow-hidden"
                                    >
                                        {searchResults.length > 0 ? (
                                            <div>
                                                {searchResults.map(product => {
                                                    const imageUrl = getImageUrl(product);
                                                    return (
                                                        <Link
                                                            key={product._id}
                                                            to={`/product/${product._id}`}
                                                            className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition"
                                                        >
                                                            <img src={imageUrl} className="w-10 h-12 object-cover rounded-sm" alt="" />
                                                            <div>
                                                                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">{product.name}</h4>
                                                                <span className="text-xs text-[#008B9E] font-bold">${product.price}</span>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                                <Link to={`/shop?search=${searchQuery}`} className="block text-center py-3 bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-[#008B9E] hover:underline">
                                                    View all results
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="p-4 text-center text-xs text-gray-400 uppercase tracking-widest">No results found</div>
                                        )}
                                    </MotionDiv>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Wishlist & Cart - Auth Only */}
                        {user && (
                            <>
                                <Link to="/wishlist" className={`relative text-gray-400 hover:text-[#008B9E] hidden md:block ${iconAnim}`}>
                                    <FaHeart size={16} />
                                    {wishlist.length > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-[#008B9E] text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                            {wishlist.length}
                                        </span>
                                    )}
                                </Link>

                                {/* Cart */}
                                <div className="relative group z-50">
                                    <Link to="/cart" className={`relative text-gray-400 hover:text-[#008B9E] group block py-4 ${iconAnim}`}>
                                        <FaShoppingCart size={16} />
                                        {itemCount > 0 && (
                                            <span className="absolute top-2 -right-2 bg-[#008B9E] text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                                {itemCount}
                                            </span>
                                        )}
                                    </Link>
                                    {/* Mini-Cart Dropdown */}
                                    <div className="absolute right-0 top-full w-80 bg-white border border-gray-100 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 origin-top-right">
                                        <div className="bg-white">
                                            {items.length === 0 ? (
                                                <div className="p-8 text-center">
                                                    <p className="text-gray-400 text-xs uppercase tracking-widest mb-4">Your cart is empty</p>
                                                    <Link to="/shop" className="text-[10px] font-bold underline hover:text-[#008B9E]">Start Shopping</Link>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="max-h-72 overflow-y-auto custom-scrollbar">
                                                        {items.map((item, idx) => {
                                                            const imageUrl = getImageUrl(item.product);
                                                            return (
                                                                <div key={`${item.product._id}-${idx}`} className="flex gap-4 p-4 border-b border-gray-50 hover:bg-gray-50 transition">
                                                                    <div className="w-12 h-16 flex-shrink-0 bg-gray-100">
                                                                        <img src={imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className="text-xs font-bold text-gray-900 truncate uppercase tracking-wide">{item.product.name}</h4>
                                                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{item.selectedSize} / {item.selectedColor}</p>
                                                                        <div className="flex justify-between items-center mt-2">
                                                                            <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                                                                            <span className="text-xs font-bold text-[#008B9E]">${item.product.price}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Subtotal</span>
                                                            <span className="text-lg font-black text-gray-900">${cartTotal.toFixed(2)}</span>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <Link to="/cart" className="text-center border border-[#008B9E] text-[#008B9E] py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#008B9E] hover:text-white transition">
                                                                View Cart
                                                            </Link>
                                                            <Link to="/checkout" className="text-center bg-[#008B9E] text-white py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#006D7C] transition shadow-lg">
                                                                Checkout
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {user ? (
                            <div className="hidden md:flex items-center gap-4 relative group">
                                <Link to="/orders" className="text-xs font-bold uppercase tracking-widest hover:text-[#008B9E] transition-colors">
                                    Account
                                </Link>
                                <div className="absolute right-0 top-full pt-4 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div className="bg-white shadow-xl border border-gray-100 p-2 flex flex-col gap-1">
                                        <div className="px-4 py-2 text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">
                                            {user.name}
                                        </div>
                                        <Link to="/orders" className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 hover:text-[#008B9E] transition-colors text-left">My Orders</Link>
                                        <Link to="/addresses" className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 hover:text-[#008B9E] transition-colors text-left">My Addresses</Link>
                                        <Link to="/wishlist" className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 hover:text-[#008B9E] transition-colors text-left">Wishlist</Link>
                                        {user.role === 'owner' && (
                                            <Link to="/admin" className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 hover:text-[#008B9E] transition-colors text-left">Admin Panel</Link>
                                        )}
                                        <button onClick={logout} className="px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors text-left w-full mt-1">Sign Out</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-4">
                                <Link to="/login" className="text-xs font-bold uppercase tracking-widest hover:text-[#008B9E] transition-colors">
                                    Login
                                </Link>
                                <Link to="/login?mode=signup" className="text-xs font-bold uppercase tracking-widest bg-[#008B9E] text-white px-5 py-2.5 hover:bg-[#006D7C] transition-colors">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <MobileDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
};

export default Navbar;

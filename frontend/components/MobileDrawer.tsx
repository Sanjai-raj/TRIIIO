import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function MobileDrawer({ open, onClose }: Props) {
    const { user, logout } = useAuth();
    const { itemCount } = useCart();
    const { wishlist } = useWishlist();

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* BACKDROP */}
                    <motion.div
                        className="fixed inset-0 z-[1100] bg-black/40 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                    />

                    {/* DRAWER */}
                    <motion.aside
                        className="fixed left-0 top-0 z-[1200] h-full w-[85%] max-w-xs bg-white p-6 shadow-2xl flex flex-col"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 25,
                        }}
                    >
                        {/* Close Button */}
                        <div className="flex justify-end mb-6">
                            <button
                                onClick={onClose}
                                className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition"
                            >
                                ✕ Close
                            </button>
                        </div>

                        {/* NAV LINKS */}
                        <nav className="flex flex-col gap-6 text-lg font-serif font-black tracking-tight">
                            <Link to="/" onClick={onClose} className="hover:text-[#008B9E] transition-colors border-b border-gray-100 pb-2">
                                Home
                            </Link>
                            <Link to="/shop" onClick={onClose} className="hover:text-[#008B9E] transition-colors border-b border-gray-100 pb-2">
                                Shop Collection
                            </Link>
                            <Link to="/cart" onClick={onClose} className="hover:text-[#008B9E] transition-colors border-b border-gray-100 pb-2">
                                Cart ({itemCount})
                            </Link>
                            <Link to="/wishlist" onClick={onClose} className="hover:text-[#008B9E] transition-colors border-b border-gray-100 pb-2">
                                Wishlist ({wishlist.length})
                            </Link>

                            <div className="mt-4 flex flex-col gap-4">
                                {user ? (
                                    <>
                                        <Link to="/orders" onClick={onClose} className="text-sm font-sans font-bold uppercase tracking-widest text-gray-600 hover:text-[#008B9E]">My Account</Link>
                                        {user.role === 'owner' && <Link to="/admin" onClick={onClose} className="text-sm font-sans font-bold uppercase tracking-widest text-gray-600 hover:text-[#008B9E]">Admin Panel</Link>}
                                        <button onClick={() => { logout(); onClose(); }} className="text-left text-sm text-red-500 font-sans font-bold uppercase tracking-widest mt-2">Log Out</button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" onClick={onClose} className="text-sm font-sans font-bold uppercase tracking-widest text-gray-600 hover:text-[#008B9E]">Login</Link>
                                        <Link to="/login?mode=signup" onClick={onClose} className="text-sm font-sans font-bold uppercase tracking-widest bg-[#008B9E] text-white px-5 py-3 text-center rounded-sm hover:bg-[#007A8A]">Create Account</Link>
                                    </>
                                )}
                            </div>
                        </nav>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}

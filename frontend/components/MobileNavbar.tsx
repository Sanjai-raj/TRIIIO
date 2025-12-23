import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Search, Percent, ShoppingBasket, UserCircle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const MobileNavbar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { itemCount } = useCart();
    const { user } = useAuth();

    // Determine active tab based on current path
    const getActiveTab = (path: string) => {
        if (path === '/') return 'Home';
        if (path.startsWith('/shop')) {
            // Distinguish between general shop/search and "Offers"
            if (location.search.includes('filter=offers')) return 'Offers';
            return 'Search';
        }
        if (path === '/cart') return 'Cart';
        if (path === '/orders' || path === '/login' || path === '/profile' || path.startsWith('/admin')) return 'Profile';
        return 'Home'; // Default or fallback
    };

    const [activeTab, setActiveTab] = useState(getActiveTab(location.pathname));

    useEffect(() => {
        setActiveTab(getActiveTab(location.pathname));
    }, [location.pathname, location.search]);

    const tabs = [
        { id: 'Home', icon: Home, path: '/' },
        { id: 'Search', icon: Search, path: '/shop' },
        { id: 'Offers', icon: Percent, path: '/shop?filter=offers' }, // Linked to Shop as requested, using query param to track active tab
        { id: 'Cart', icon: ShoppingBasket, path: '/cart' },
        { id: 'Profile', icon: UserCircle, path: user ? '/orders' : '/login' },
    ];

    const handleTabClick = (tabId: string, path: string) => {
        setActiveTab(tabId);
        navigate(path);
    };

    return (
        <>
            {/* Top Bar for Logo */}
            <div className="sticky top-0 z-[1000] bg-white border-b border-gray-100 shadow-sm h-16 flex items-center justify-center px-6">
                <Link to="/" className="flex items-center gap-2 group">
                    <BrandLogo className="h-8 w-auto" />
                    <span className="text-2xl font-sans font-black tracking-tighter text-[#008B9E]">TRIIIO</span>
                </Link>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[1000]">
                <div className="flex w-[95vw] sm:w-[420px] items-center justify-between rounded-full bg-[#121217] p-2 shadow-2xl gap-0 sm:gap-2 px-4">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        const Icon = tab.icon;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabClick(tab.id, tab.path)}
                                className={`relative flex h-12 w-auto min-w-[3.5rem] px-3 items-center justify-center rounded-full transition-colors duration-300 ${isActive ? 'bg-white text-[#121217]' : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-2 relative z-10">
                                    <div className="relative">
                                        <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                        {/* Cart Badge */}
                                        {tab.id === 'Cart' && itemCount > 0 && !isActive && (
                                            <span className="absolute -top-1.5 -right-1.5 bg-[#008B9E] text-white text-[9px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center border border-[#121217]">
                                                {itemCount}
                                            </span>
                                        )}
                                    </div>

                                    {/* Text appears only when active */}
                                    {isActive && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: 'auto' }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden whitespace-nowrap text-sm font-bold"
                                        >
                                            {tab.id}
                                        </motion.span>
                                    )}
                                </div>

                                {/* Framer Motion Layout Animation for the "Pill" effect */}
                                {isActive && (
                                    <motion.div
                                        layoutId="pill"
                                        className="absolute inset-0 z-0 rounded-full bg-white"
                                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Spacer removed to fix top spacing issue */}
        </>
    );
};

export default MobileNavbar;

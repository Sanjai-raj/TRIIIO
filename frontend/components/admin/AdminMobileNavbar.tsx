import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// Added LogOut icon
import { LayoutDashboard, Shirt, Package, Users, LogOut, Store } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BrandLogo from '../BrandLogo';
import { useAuth } from '../../context/AuthContext';

const AdminMobileNavbar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth(); // Access logout function

    const getActiveTab = (path: string) => {
        if (path.includes('/admin/dashboard')) return 'Dashboard';
        if (path.includes('/admin/products')) return 'Products';
        if (path.includes('/admin/orders')) return 'Orders';
        if (path.includes('/admin/users')) return 'Users';
        return 'Dashboard';
    };

    const [activeTab, setActiveTab] = useState(getActiveTab(location.pathname));

    useEffect(() => {
        setActiveTab(getActiveTab(location.pathname));
    }, [location.pathname]);

    const tabs = [
        { id: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { id: 'Products', icon: Shirt, path: '/admin/products' },
        { id: 'Orders', icon: Package, path: '/admin/orders' },
        { id: 'Users', icon: Users, path: '/admin/users' },
    ];

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <>
            {/* Top Bar with Logout */}
            <div className="sticky top-0 z-[1000] bg-[#008B9E] border-b border-[#007a8a] shadow-md h-16 flex items-center justify-between px-5 relative">
                {/* Left Side: Store Link */}
                <Link to="/" className="p-2 hover:bg-white/10 rounded-full transition-colors text-white" aria-label="Go to Store">
                    <Store size={20} />
                </Link>

                {/* Center: Logo and Title (Refreshes Page) */}
                <div
                    onClick={() => window.location.reload()}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 group cursor-pointer"
                >
                    <BrandLogo className="h-6 w-auto brightness-0 invert" />
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-sans font-black tracking-tighter text-white">TRIIIO</span>
                        <span className="text-[10px] font-bold text-teal-100 uppercase tracking-widest opacity-80">ADMIN</span>
                    </div>
                </div>

                {/* Right Side: Logout Button */}
                <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                    aria-label="Logout"
                >
                    <LogOut size={20} />
                </button>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[1000]">
                <div className="flex w-[95vw] sm:w-[420px] items-center justify-between rounded-2xl bg-[#008B9E] p-2 shadow-2xl px-4 border border-white/10">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        const Icon = tab.icon;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => navigate(tab.path)}
                                className={`relative flex h-12 w-auto min-w-[3.5rem] px-4 items-center justify-center rounded-xl transition-all duration-300 ${isActive ? 'text-white' : 'text-teal-100/60 hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-2 relative z-10">
                                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                    {isActive && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -5 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="whitespace-nowrap text-sm font-bold"
                                        >
                                            {tab.id}
                                        </motion.span>
                                    )}
                                </div>

                                {isActive && (
                                    <motion.div
                                        layoutId="admin-pill"
                                        className="absolute inset-0 z-0 rounded-xl bg-white/20 backdrop-blur-md border border-white/20"
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default AdminMobileNavbar;

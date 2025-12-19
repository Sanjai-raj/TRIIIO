import React from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';
import { FaChartLine, FaTshirt, FaBox, FaUsers } from 'react-icons/fa';

const AdminLayout: React.FC = () => {
    const { user, isAdmin, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) return <div className="p-10 text-center text-[#008B9E]">Loading...</div>;
    if (!user || !isAdmin) return <Navigate to="/login" />;

    const isActive = (path: string) => location.pathname === path ? 'bg-white text-[#008B9E]' : 'text-white/70 hover:text-white hover:bg-white/10';

    return (
        <div className="flex h-screen bg-gray-100 text-gray-900 overflow-hidden font-sans">
            <aside className="w-64 flex-shrink-0 bg-[#008B9E] flex flex-col shadow-2xl z-20">
                <div className="p-6 text-xl font-bold text-white border-b border-white/10 tracking-tight flex items-center gap-3">
                    <BrandLogo className="h-6 w-auto fill-white" />
                    <span><span className="text-white">TRIIIO</span> ADMIN</span>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin" className={`block px-4 py-3 rounded-md flex items-center gap-3 transition ${isActive('/admin')}`}>
                        <FaChartLine /> Dashboard
                    </Link>
                    <Link to="/admin/products" className={`block px-4 py-3 rounded-md flex items-center gap-3 transition ${isActive('/admin/products')}`}>
                        <FaTshirt /> Products
                    </Link>
                    <Link to="/admin/orders" className={`block px-4 py-3 rounded-md flex items-center gap-3 transition ${isActive('/admin/orders')}`}>
                        <FaBox /> Orders
                    </Link>
                    <Link to="/admin/users" className={`block px-4 py-3 rounded-md flex items-center gap-3 transition ${isActive('/admin/users')}`}>
                        <FaUsers /> Users
                    </Link>
                </nav>
                <div className="p-4 border-t border-white/10">
                    <Link to="/" className="block text-center text-xs uppercase font-bold text-white/50 hover:text-white transition">Back to Store</Link>
                </div>
            </aside>
            <main className="flex-1 overflow-auto bg-gray-50 p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;

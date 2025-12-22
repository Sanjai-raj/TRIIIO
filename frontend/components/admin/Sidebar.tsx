import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import BrandLogo from '../BrandLogo';
import { FaChartLine, FaTshirt, FaBox, FaUsers } from 'react-icons/fa';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5';

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Drawer */}
            <aside className={`main-sidebar bg-[#008B9E] shadow-2xl w-[260px] min-h-screen text-sm fixed left-0 top-0 bottom-0 flex flex-col z-20 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                {/* Brand Logo */}
                <Link to="/admin" className="brand-link h-[57px] flex items-center px-4 border-b border-white/10 text-white font-bold gap-3 hover:text-white">
                    <BrandLogo className="h-6 w-auto fill-white" />
                    <span className="brand-text font-light tracking-wide"><span className="font-bold">TRIIIO</span> ADMIN</span>
                </Link>

                {/* Sidebar Menu */}
                <div className="sidebar flex-1 overflow-y-auto p-2">
                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-col space-y-1" role="menu">
                            <li className="nav-item">
                                <Link to="/admin" className={`nav-link flex items-center gap-3 px-3 py-2 rounded-md transition duration-200 ${isActive('/admin')}`} onClick={() => window.innerWidth < 1024 && onClose()}>
                                    <FaChartLine className="text-lg" />
                                    <p>Dashboard</p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/admin/products" className={`nav-link flex items-center gap-3 px-3 py-2 rounded-md transition duration-200 ${isActive('/admin/products')}`} onClick={() => window.innerWidth < 1024 && onClose()}>
                                    <FaTshirt className="text-lg" />
                                    <p>Products</p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/admin/orders" className={`nav-link flex items-center gap-3 px-3 py-2 rounded-md transition duration-200 ${isActive('/admin/orders')}`} onClick={() => window.innerWidth < 1024 && onClose()}>
                                    <FaBox className="text-lg" />
                                    <p>Orders</p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/admin/users" className={`nav-link flex items-center gap-3 px-3 py-2 rounded-md transition duration-200 ${isActive('/admin/users')}`} onClick={() => window.innerWidth < 1024 && onClose()}>
                                    <FaUsers className="text-lg" />
                                    <p>Users</p>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="p-4 border-t border-white/10">
                    <Link to="/" className="block text-center text-xs uppercase font-bold text-white/50 hover:text-white transition">Back to Store</Link>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

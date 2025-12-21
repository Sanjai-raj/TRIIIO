import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            {/* Overlay (mobile only) */}
            {open && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-screen w-[260px]
          bg-[#008c99] text-white z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
            >
                {/* Header */}
                <div className="h-14 flex items-center px-4 font-bold border-b border-white/20">
                    TRIIIO ADMIN
                </div>

                {/* Menu */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <Link
                        to="/admin"
                        onClick={onClose}
                        className={`block px-3 py-2 rounded hover:bg-white/10 ${isActive('/admin') ? 'bg-white/20 font-semibold' : ''}`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/admin/products"
                        onClick={onClose}
                        className={`block px-3 py-2 rounded hover:bg-white/10 ${isActive('/admin/products') ? 'bg-white/20 font-semibold' : ''}`}
                    >
                        Products
                    </Link>
                    <Link
                        to="/admin/orders"
                        onClick={onClose}
                        className={`block px-3 py-2 rounded hover:bg-white/10 ${isActive('/admin/orders') ? 'bg-white/20 font-semibold' : ''}`}
                    >
                        Orders
                    </Link>
                    <Link
                        to="/admin/users"
                        onClick={onClose}
                        className={`block px-3 py-2 rounded hover:bg-white/10 ${isActive('/admin/users') ? 'bg-white/20 font-semibold' : ''}`}
                    >
                        Users
                    </Link>
                </nav>

                {/* Footer */}
                <div className="px-4 py-4 border-t border-white/20 text-sm">
                    <Link to="/" className="hover:text-gray-200">BACK TO STORE</Link>
                </div>
            </aside>
        </>
    );
}

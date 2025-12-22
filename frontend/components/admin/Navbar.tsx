import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

interface NavbarProps {
    onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
    const { logout } = useAuth();

    return (
        <nav className="main-header navbar navbar-expand navbar-white navbar-light border-b border-gray-200 bg-white h-[57px] flex items-center justify-between px-4 z-30 sticky top-0 w-full">
            {/* Left navbar links */}
            <ul className="navbar-nav flex items-center gap-3">
                <li className="nav-item lg:hidden">
                    <button onClick={onToggleSidebar} className="text-gray-600 hover:text-[#008B9E] p-1">
                        <FaBars className="text-xl" />
                    </button>
                </li>
                <li className="nav-item">
                    {/* Placeholder for sidebar toggle if later needed */}
                    <span className="text-gray-500 font-bold tracking-tight">Admin Console</span>
                </li>
            </ul>

            {/* Right navbar links */}
            <ul className="navbar-nav ml-auto flex items-center gap-4">
                <li className="nav-item">
                    <button onClick={logout} className="text-sm font-medium text-red-500 hover:text-red-700">Logout</button>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MotionDiv = motion.div as any;

const AnimatedOutlet: React.FC = () => {
    const location = useLocation();
    return (
        <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex-grow flex flex-col"
        >
            <Outlet />
        </motion.main>
    );
};

const PublicLayout: React.FC = () => {
    const location = useLocation();
    const isShop = location.pathname === '/shop';

    return (
        <div className={`flex flex-col min-h-screen bg-white text-gray-900 font-sans selection:bg-[#008B9E] selection:text-white ${isShop ? 'md:pb-[350px]' : ''}`}>
            <Navbar />
            <AnimatedOutlet />
            <div className={isShop ? 'md:fixed md:bottom-0 md:left-0 md:right-0 md:z-10' : ''}>
                <Footer />
            </div>
        </div>
    );
};

export default PublicLayout;

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
            className="flex-1 w-full flex flex-col"
        >
            <Outlet />
        </motion.main>
    );
};

const PublicLayout: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans selection:bg-[#008B9E] selection:text-white">
            <Navbar />
            <AnimatedOutlet />
            <Footer />
        </div>
    );
};

export default PublicLayout;

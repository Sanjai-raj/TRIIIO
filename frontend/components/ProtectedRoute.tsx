import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ProtectedRoute: React.FC = () => {
    const { user, isLoading, isAdmin } = useAuth();

    useEffect(() => {
        if (!isLoading && !user) {
            toast.error("Please login to continue");
        } else if (!isLoading && user && !isAdmin) {
            toast.error("Access denied: Admins only");
        }
    }, [isLoading, user, isAdmin]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-[#008B9E]" size={40} />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        // If logged in but not admin, redirect to home or show denied page
        // For now preventing access to admin routes
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;

import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

interface AdminLayoutProps {
    children?: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const { user, isAdmin, isLoading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    if (isLoading) return <div className="p-10 text-center text-[#008B9E]">Loading...</div>;
    if (!user || !isAdmin) return <Navigate to="/login" />;

    return (
        <div className="wrapper bg-gray-50 min-h-screen text-gray-900 font-sans">
            <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="content-wrapper ml-0 lg:ml-[250px] p-4 lg:p-6 transition-all duration-300">
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;

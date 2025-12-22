import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import Navbar from "../components/admin/Navbar";

export default function AdminLayout({ children }: { children?: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar onToggleSidebar={() => setOpen(!open)} />

            {/* Sidebar */}
            <Sidebar isOpen={open} onClose={() => setOpen(false)} />

            {/* Content */}
            <main className="lg:ml-[250px] p-6 transition-all duration-300">
                {children || <Outlet />}
            </main>
        </div>
    );
}

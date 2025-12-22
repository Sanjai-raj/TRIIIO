import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import Navbar from "../components/admin/Navbar";

const SIDEBAR_WIDTH = 260;
const NAVBAR_HEIGHT = 57;

export default function AdminLayout({ children }: { children?: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 relative overflow-x-hidden">

            {/* FIXED SIDEBAR */}
            <Sidebar isOpen={open} onClose={() => setOpen(false)} />

            {/* NAVBAR SECTION */}
            <div className="relative z-30 ml-0 md:ml-[260px] w-full md:w-[calc(100%_-_260px)] transition-all duration-300">
                <Navbar onToggleSidebar={() => setOpen(!open)} />
            </div>

            {/* PAGE CONTENT SECTION */}
            <main
                className="relative z-10 ml-0 md:ml-[260px] w-full md:w-[calc(100%_-_260px)] transition-all duration-300 p-6 min-h-[calc(100vh-57px)]"
            >
                {children || <Outlet />}
            </main>
        </div>
    );
}

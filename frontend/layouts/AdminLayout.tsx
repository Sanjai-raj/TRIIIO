import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import Navbar from "../components/admin/Navbar";

const SIDEBAR_WIDTH = 260;
const NAVBAR_HEIGHT = 57;

export default function AdminLayout({ children }: { children?: React.ReactNode }) {
    const [open, setOpen] = useState(true);

    return (
        <div className="min-h-screen flex bg-gray-50 overflow-hidden">

            {/* LEFT SIDEBAR (FIXED WIDTH, NO OVERLAP) */}
            <aside
                className={`hidden md:flex flex-col bg-white border-r`}
                style={{ width: SIDEBAR_WIDTH }}
            >
                <Sidebar isOpen={open} onClose={() => setOpen(false)} />
            </aside>

            {/* RIGHT ADMIN AREA */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">

                {/* NAVBAR */}
                <header
                    className="sticky top-0 z-30 bg-white border-b flex-shrink-0"
                    style={{ height: NAVBAR_HEIGHT }}
                >
                    <Navbar onToggleSidebar={() => setOpen(!open)} />
                </header>

                {/* PAGE CONTENT */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {children || <Outlet />}
                </main>

            </div>
        </div>
    );
}

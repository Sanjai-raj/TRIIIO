import React, { useState } from "react";
import Sidebar from "../components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile top bar */}
            <div className="lg:hidden flex items-center justify-between bg-[#008c99] text-white px-4 h-14 fixed top-0 left-0 right-0 z-40 shadow-md">
                <button onClick={() => setOpen(true)} className="text-xl">
                    ☰
                </button>
                <span className="font-semibold tracking-wide">TRIIIO ADMIN</span>
                <div className="w-6"></div> {/* Spacer for centering if needed, or keeping title left/center */}
            </div>

            {/* Sidebar */}
            <Sidebar open={open} onClose={() => setOpen(false)} />

            {/* Content */}
            <main className="pt-14 lg:pt-0 lg:ml-[260px] p-6 transition-all duration-300">
                {children}
            </main>
        </div>
    );
}

import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';

export default function Footer() {
    return (
        <footer className="bg-[#0b4d57] text-white">
            <div className="max-w-7xl mx-auto px-4 py-7">

                <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4 md:gap-10">

                    {/* LEFT — BRAND */}
                    <div className="col-span-2 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-2">
                            <BrandLogo className="h-7 w-auto brightness-0 invert" />
                            <span className="text-lg font-bold">TRIIIO</span>
                        </Link>
                        <p className="text-xs text-white/75 leading-snug">
                            Elevating everyday essentials with premium materials
                            and minimalist design.
                        </p>
                    </div>

                    {/* LEFT — SHOP (2 COLUMN LIST) */}
                    <div>
                        <h3 className="text-xs font-semibold mb-1">SHOP</h3>
                        <ul className="
                            grid grid-cols-2 gap-x-3 gap-y-1
                            text-xs text-white/80
                        ">
                            <li>Formal</li>
                            <li>Casual</li>
                            <li className="col-span-2">New Arrivals</li>
                        </ul>
                    </div>

                    {/* RIGHT — COMPANY (2 COLUMN LIST) */}
                    <div>
                        <h3 className="text-xs font-semibold mb-1">COMPANY</h3>
                        <ul className="
                            grid grid-cols-2 gap-x-3 gap-y-1
                            text-xs text-white/80
                        ">
                            <li>About Us</li>
                            <li>Legal & Privacy</li>
                        </ul>
                    </div>

                    {/* LEFT — CONTACT (BELOW SHOP) */}
                    <div className="col-span-2 md:col-span-1">
                        <h3 className="text-xs font-semibold mb-1">CONTACT</h3>
                        <ul className="space-y-1 text-xs text-white/80">
                            <li>📍 Tirupur, Tamil Nadu</li>
                            <li>✉️ support@triiio.com</li>
                            <li>📞 +91 9345830932</li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* FOOTER BOTTOM */}
            <div className="border-t border-white/15">
                <p className="text-center text-[10px] text-white/60 py-3">
                    © 2025 TRIIIO. ALL RIGHTS RESERVED.
                </p>
            </div>
        </footer>
    );
}

import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';

export default function Footer() {
    return (
        <footer className="bg-[#0b4d57] text-white">
            {/* MAIN FOOTER */}
            <div className="max-w-7xl mx-auto px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

                    {/* BRAND — LEFT */}
                    <div>
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <BrandLogo className="h-8 w-auto brightness-0 invert" />
                            <span className="text-2xl font-bold tracking-wide text-white">TRIIIO</span>
                        </Link>
                        <p className="mt-3 text-sm text-white/80 max-w-xs">
                            Elevating everyday essentials with premium materials
                            and minimalist design.
                        </p>
                    </div>

                    {/* SHOP */}
                    <div>
                        <h3 className="text-sm font-semibold mb-4">SHOP</h3>
                        <ul className="space-y-2 text-sm text-white/80">
                            <li>Formal</li>
                            <li>Casual</li>
                            <li>New Arrivals</li>
                        </ul>
                    </div>

                    {/* COMPANY */}
                    <div>
                        <h3 className="text-sm font-semibold mb-4">COMPANY</h3>
                        <ul className="space-y-2 text-sm text-white/80">
                            <li>About Us</li>
                            <li>Legal & Privacy</li>
                        </ul>
                    </div>

                    {/* CONTACT — RIGHT */}
                    <div className="md:text-right">
                        <h3 className="text-sm font-semibold mb-4">CONTACT</h3>
                        <ul className="space-y-3 text-sm text-white/80">
                            <li>📍 2443 Oak Ridge Omaha, QA 45065</li>
                            <li>✉️ support@triiio.com</li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* FOOTER BOTTOM */}
            <div className="border-t border-white/20">
                <p className="text-center text-xs text-white/70 py-4">
                    © 2025 TRIIIO. ALL RIGHTS RESERVED.
                </p>
            </div>
        </footer>
    );
}

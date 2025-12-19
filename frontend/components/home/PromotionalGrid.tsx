import { useNavigate } from 'react-router-dom';
import { LazyImage } from '../LazyImage';

export default function FeaturedCollections() {
    const navigate = useNavigate();

    return (
        <section className="w-full py-10 sm:py-14 lg:py-20 bg-white">
            <div className="container mx-auto px-6">

                {/* SECTION HEADER */}
                <div className="mb-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                        Curated Styles
                    </h2>
                    <p className="mt-2 text-sm uppercase tracking-[0.3em] text-slate-500">
                        Fresh Styles & Customer Favorites
                    </p>
                </div>

                {/* CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* NEW ARRIVALS */}
                    <div className="relative h-[420px] bg-gray-200 rounded-sm overflow-hidden group">
                        <LazyImage
                            src="/promo-new-arrivals.jpg"
                            alt="New Arrivals"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />

                        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white">
                            <h3 className="text-3xl font-extrabold tracking-widest mb-4">
                                NEW<br />ARRIVALS
                            </h3>

                            <button onClick={() => navigate('/shop')} className="bg-white text-[#008B9E] px-8 py-3 text-sm font-semibold tracking-wide hover:bg-[#008B9E] hover:text-white transition">
                                SHOP NOW
                            </button>
                        </div>
                    </div>

                    {/* BEST SELLERS */}
                    <div className="relative h-[420px] rounded-sm overflow-hidden group">
                        <LazyImage
                            src="/promo-best-sellers.jpg"
                            alt="Best Sellers"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />

                        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white">
                            <h3 className="text-3xl font-extrabold tracking-widest mb-4">
                                BEST<br />SELLERS
                            </h3>

                            <button onClick={() => navigate('/shop')} className="bg-white text-[#008B9E] px-8 py-3 text-sm font-semibold tracking-wide hover:bg-[#008B9E] hover:text-white transition">
                                SHOP NOW
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

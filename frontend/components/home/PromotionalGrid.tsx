import { useNavigate } from 'react-router-dom';

export default function FeaturedCollections() {
    const navigate = useNavigate();

    return (
        <section className="w-full py-10 md:py-12 bg-white font-sans">
            <div className="container mx-auto px-4 md:px-6">

                {/* HEADER SECTION */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 gap-6 md:gap-4">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-gray-900 uppercase leading-none font-sans">
                        Unleash Your <br /> <span className="text-[#008B9E]">Fashion Fantasy</span>
                    </h2>

                    <div className="flex flex-col items-start md:items-end">
                        <div className="mb-4 hidden md:block">
                            <div className="w-10 h-6 border-2 border-[#008B9E] rounded-full relative">
                                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-[#008B9E]"></div>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/shop')}
                            className="bg-[#008B9E] text-white px-6 md:px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#006D7C] transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-300 w-auto"
                        >
                            DISCOVER COLLECTION <span className="text-sm">→</span>
                        </button>
                    </div>
                </div>

                <hr className="border-gray-100 mb-8 md:mb-10" />

                {/* CARDS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* LEFT CARD */}
                    <div className="relative group overflow-hidden rounded-3xl h-[400px] md:h-[500px] shadow-sm">
                        <img
                            src="/promo-formal.jpg"
                            alt="Long Sleeve T-Shirt"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 flex items-center pointer-events-none">
                            <span className="text-white/10 text-6xl md:text-9xl font-black ml-[-10px] md:ml-[-20px] tracking-tighter uppercase transition-opacity duration-500 group-hover:opacity-40">NIKE</span>
                        </div>

                        {/* DESIGN MARKED IN BLACK RECTANGLE WITH HOVER EFFECT */}
                        <div className="absolute bottom-0 right-0 bg-white pt-6 pl-6 pr-4 pb-4 md:pt-10 md:pl-10 md:pr-8 md:pb-8 rounded-tl-[40px] md:rounded-tl-[60px] shadow-2xl transition-all duration-500 ease-in-out group-hover:pt-12 group-hover:pl-12">
                            <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 text-center transition-colors group-hover:text-black">
                                Classic Formal
                            </p>
                            <button
                                onClick={() => navigate('/shop?category=Topwear')}
                                className="bg-[#008B9E] text-white px-8 md:px-12 py-2.5 md:py-3 rounded-full text-[10px] md:text-xs font-bold uppercase flex items-center justify-center gap-2 hover:bg-[#006D7C] transition-transform active:scale-95 shadow-md"
                            >
                                SHOP NOW <span>→</span>
                            </button>
                        </div>
                    </div>

                    {/* RIGHT CARD */}
                    <div className="relative group overflow-hidden rounded-3xl h-[400px] md:h-[500px] shadow-sm">
                        <img
                            src="/promo-denim.jpg"
                            alt="Urban Sneaker"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 flex items-start pt-10 md:pt-20 pointer-events-none pl-4">
                            <span className="text-white/20 text-5xl md:text-8xl font-black tracking-tighter leading-none uppercase transition-opacity duration-500 group-hover:opacity-50">Brand<br />New</span>
                        </div>

                        {/* DESIGN MARKED IN BLACK RECTANGLE WITH HOVER EFFECT */}
                        <div className="absolute bottom-0 right-0 bg-white pt-6 pl-6 pr-4 pb-4 md:pt-10 md:pl-10 md:pr-8 md:pb-8 rounded-tl-[40px] md:rounded-tl-[60px] shadow-2xl transition-all duration-500 ease-in-out group-hover:pt-12 group-hover:pl-12">
                            <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 text-center transition-colors group-hover:text-black">
                                Rugged Denim
                            </p>
                            <button
                                onClick={() => navigate('/shop?category=Footwear')}
                                className="bg-[#008B9E] text-white px-8 md:px-12 py-2.5 md:py-3 rounded-full text-[10px] md:text-xs font-bold uppercase flex items-center justify-center gap-2 hover:bg-[#006D7C] transition-transform active:scale-95 shadow-md"
                            >
                                SHOP NOW <span>→</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
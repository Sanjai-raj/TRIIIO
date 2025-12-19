import { useEffect, useState } from "react";
// @ts-ignore
import { useNavigate } from "react-router-dom";

const slides = [
    {
        title: "YOUR NEXT LOOK AWAITS",
        description: "Discover effortless, modern shirts designed for everyday comfort.",
        button: "SHOP SHIRTS",
        link: "/shop",
        image: "/hero_cover.png"
    },
    {
        title: "MODERN CASUALS",
        description: "Clean fits, premium fabrics, timeless design.",
        button: "EXPLORE CASUALS",
        link: "/shop?category=casual",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "ESSENTIAL COMFORT",
        description: "Everyday wear made simple and stylish.",
        button: "VIEW COLLECTION",
        link: "/shop?category=formal",
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80"
    }
];

export default function HomeSlider() {
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const slide = slides[index];

    return (
        <section className="min-h-screen flex items-center bg-[#F8F6F2] transition-colors duration-700">
            <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

                {/* TEXT */}
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700" key={`text-${index}`}>
                    <h1 className="text-4xl md:text-5xl font-serif text-gray-900 leading-tight">
                        {slide.title}
                    </h1>

                    <p className="text-gray-600 max-w-md text-lg">
                        {slide.description}
                    </p>

                    <button
                        onClick={() => navigate(slide.link)}
                        className="border border-gray-900 px-8 py-3 text-sm tracking-wide hover:bg-gray-900 hover:text-white transition-all duration-300"
                    >
                        {slide.button}
                    </button>
                </div>

                {/* IMAGE */}
                <div className="flex justify-center h-[500px] items-center">
                    <img
                        key={`img-${index}`}
                        src={slide.image}
                        alt={slide.title}
                        className="max-h-full max-w-full object-contain animate-in fade-in zoom-in-95 duration-1000"
                    />
                </div>

            </div>
        </section>
    );
}

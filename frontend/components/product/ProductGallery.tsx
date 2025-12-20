import { useState, useRef, useEffect } from "react";
// @ts-ignore
import { PLACEHOLDER_IMG } from "../../src/constants";
import ImageZoomModal from "./ImageZoomModal";


interface ProductGalleryProps {
    variants: { color: string; images: string[] }[];
    selectedColor: string;
    images?: { url: string }[]; // Fallback for legacy
}

export default function ProductGallery({ variants, selectedColor, images: legacyImages }: ProductGalleryProps) {
    // Determine active images: 
    // 1. Try to find variant match
    // 2. Fallback to legacy images if provided
    // 3. Fallback to placeholder

    let activeImages: string[] = [];

    if (variants && variants.length > 0 && selectedColor) {
        const variant = variants.find(v => v.color.toLowerCase() === selectedColor.toLowerCase());
        if (variant && variant.images && variant.images.length > 0) {
            activeImages = variant.images;
        }
    }

    // Fallback if no specific variant found or no variants provided
    if (activeImages.length === 0 && legacyImages && legacyImages.length > 0) {
        activeImages = legacyImages.map(img => img.url);
    }

    // Final fallback
    if (activeImages.length === 0) {
        activeImages = [PLACEHOLDER_IMG];
    }

    const [active, setActive] = useState(0);
    const [zoomOpen, setZoomOpen] = useState(false);

    // Reset active index when color changes
    useEffect(() => {
        setActive(0);
    }, [selectedColor]);

    // Preload Main Image LCP
    useEffect(() => {
        if (!activeImages || activeImages.length === 0) return;
        const imgUrl = activeImages[0];
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = imgUrl;
        // @ts-ignore
        link.fetchPriority = "high";
        document.head.appendChild(link);
        return () => { document.head.removeChild(link); };
    }, [activeImages]);

    const startX = useRef(0);

    const onTouchStart = (e: any) => {
        startX.current = e.touches[0].clientX;
    };

    const onTouchEnd = (e: any) => {
        const diff = startX.current - e.changedTouches[0].clientX;
        // Swipe Left -> Next
        if (diff > 50 && active < activeImages.length - 1) setActive(active + 1);
        // Swipe Right -> Prev
        if (diff < -50 && active > 0) setActive(active - 1);
    };

    return (
        <>
            <div className="flex gap-2 h-full">
                {/* LEFT THUMBNAILS */}
                {activeImages.length > 1 && (
                    <div className="flex flex-col gap-2 w-12 flex-shrink-0">
                        {activeImages.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setActive(i)}
                                className={`w-12 h-16 rounded-sm border overflow-hidden transition-all ${i === active ? "ring-2 ring-[#008B9E] border-transparent" : "border-gray-200"
                                    }`}
                            >
                                <img
                                    src={img || PLACEHOLDER_IMG}
                                    alt="Main Product"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = PLACEHOLDER_IMG;
                                    }}
                                />
                            </button>
                        ))}
                    </div>
                )}

                {/* MAIN IMAGE */}
                <div
                    className="relative aspect-[4/5] w-full rounded-lg bg-gray-50 overflow-hidden cursor-zoom-in"
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                    onClick={() => setZoomOpen(true)}
                >
                    <img
                        src={activeImages[active]}
                        alt="Product"
                        onError={(e) => {
                            console.error("GALLERY IMAGE FAILED:", activeImages[active]);
                            e.currentTarget.src = PLACEHOLDER_IMG;
                        }}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                        loading="eager"

                    />

                    {/* Zoom Hint Icon */}
                    <div className="absolute bottom-2 right-2 bg-black/10 backdrop-blur-sm p-1.5 rounded-full text-white/70 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                    </div>
                </div>
            </div>

            <ImageZoomModal
                open={zoomOpen}
                image={activeImages[active]}
                onClose={() => setZoomOpen(false)}
            />
        </>
    );
}

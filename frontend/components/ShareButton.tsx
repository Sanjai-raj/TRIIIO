import { useState, useRef, useEffect } from "react";

interface ShareButtonProps {
    productName: string;
    productUrl: string;
}

export default function ShareButton({
    productName,
    productUrl,
}: ShareButtonProps) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    /* ---------- ANALYTICS ---------- */
    const trackShare = (method: string) => {
        console.log("SHARE_EVENT", {
            method,
            product: productName,
            url: productUrl,
        });
    };

    /* ---------- CLOSE ON OUTSIDE CLICK ---------- */
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    /* ---------- NATIVE SHARE (MOBILE) ---------- */
    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: productName,
                    url: productUrl,
                });
                trackShare("native");
                return;
            } catch {
                // user cancelled
            }
        }
        // Toggle open state
        setOpen((prev) => !prev);
    };

    /* ---------- WHATSAPP ---------- */
    const shareWhatsApp = () => {
        const text = encodeURIComponent(
            `${productName}\n\nCheck this out:\n${productUrl}`
        );
        window.open(`https://wa.me/?text=${text}`, "_blank");
        trackShare("whatsapp");
        setOpen(false);
    };

    /* ---------- EMAIL ---------- */
    const shareEmail = () => {
        const subject = encodeURIComponent(productName);
        const body = encodeURIComponent(
            `Hi,\n\nCheck out this product:\n${productUrl}`
        );
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
        trackShare("email");
        setOpen(false);
    };

    return (
        <div className="relative z-40" ref={menuRef}>
            <button
                onClick={handleNativeShare}
                aria-label="Share product"
                className={`
          group flex items-center justify-center 
          w-9 h-9 md:w-8 md:h-8 rounded-full 
          border border-gray-200 bg-white 
          text-gray-500 transition-all duration-200
          hover:border-gray-300 hover:text-gray-800 hover:shadow-sm
          focus:outline-none focus:ring-2 focus:ring-gray-100
        `}
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                </svg>
            </button>

            {/* SHARE OPTIONS DROPDOWN */}
            {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 z-[100] origin-top-right">
                    {/* Tiny arrow pointer optionally can stay or go. Cleaner without for minimal UI. */}
                    <button
                        onClick={shareWhatsApp}
                        className="w-full px-4 py-2.5 text-xs font-medium text-left hover:bg-gray-50 flex items-center gap-2.5 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> WhatsApp
                    </button>

                    <button
                        onClick={shareEmail}
                        className="w-full px-4 py-2.5 text-xs font-medium text-left hover:bg-gray-50 flex items-center gap-2.5 text-gray-600 hover:text-gray-900 transition-colors border-t border-gray-50"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Email
                    </button>
                </div>
            )}
        </div>
    );
}

import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

interface Props {
    sort: string;
    onSortChange: (value: string) => void;
}

export function SortBy({ sort, onSortChange }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (value: string) => {
        onSortChange(value);
        setOpen(false);
    };

    const getLabel = () => {
        if (sort === "price_asc") return "Price: Low to High";
        if (sort === "price_desc") return "Price: High to Low";
        return "Newest";
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-gray-200 px-4 py-3 rounded-sm hover:border-[#008B9E] transition-colors bg-white w-full md:w-auto justify-between"
            >
                <span className="text-gray-400 mr-2">Sort by</span>
                <span className="text-gray-900">{getLabel()}</span>
                <FaChevronDown className={`ml-2 text-[10px] text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-full md:w-48 bg-white border border-gray-100 rounded-sm shadow-xl animate-fadeIn z-30 overflow-hidden">
                    <div className="flex flex-col">
                        {[
                            { label: "Newest", value: "" },
                            { label: "Price: Low to High", value: "price_asc" },
                            { label: "Price: High to Low", value: "price_desc" },
                        ].map((opt) => (
                            <button
                                key={opt.label}
                                onClick={() => handleSelect(opt.value)}
                                className={`block w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors ${sort === opt.value ? "text-[#008B9E] bg-gray-50" : "text-gray-600"}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

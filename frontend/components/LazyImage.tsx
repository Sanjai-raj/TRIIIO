import { useEffect, useRef, useState } from "react";

interface Props {
    src: string;
    alt: string;
    className?: string;
}

export function LazyImage({ src, alt, className }: Props) {
    const ref = useRef<HTMLImageElement>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setLoaded(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) observer.observe(ref.current);

        return () => observer.disconnect();
    }, []);

    return (
        <img
            ref={ref}
            src={loaded ? src : undefined}
            alt={alt}
            className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"
                } ${className}`}
        />
    );
}

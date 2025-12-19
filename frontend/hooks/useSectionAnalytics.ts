import { useEffect, useRef } from "react";

export function useSectionAnalytics(sectionName: string) {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    console.log("Section Viewed:", sectionName);

                    // Example: Google Analytics
                    // window.gtag("event", "view_section", { section: sectionName });

                    observer.disconnect();
                }
            },
            { threshold: 0.6 }
        );

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [sectionName]);

    return ref;
}

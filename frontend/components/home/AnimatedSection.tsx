import React from "react";
import { motion } from "framer-motion";

interface SectionProps {
    id?: number;
    title: string;
    description: string;
    cta: string;
    image: string;
    bg: string;
    align: "left" | "right";
}

export default function AnimatedSection({
    title,
    description,
    cta,
    image,
    bg,
    align,
}: SectionProps) {
    const isLeft = align === "left";

    return (
        <section
            className="min-h-screen flex items-center"
            style={{ backgroundColor: bg }}
        >
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

                {/* TEXT */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className={`${isLeft ? "order-1" : "order-2"}`}
                >
                    <h2 className="font-serif text-[clamp(2.2rem,5vw,3.5rem)] text-gray-900 leading-tight">
                        {title}
                    </h2>

                    <p className="mt-6 text-gray-600 max-w-md text-[clamp(1rem,2.5vw,1.1rem)]">
                        {description}
                    </p>

                    <button className="mt-8 border border-gray-900 px-8 py-3 text-sm tracking-wide hover:bg-gray-900 hover:text-white transition">
                        {cta}
                    </button>
                </motion.div>

                {/* IMAGE */}
                <motion.div
                    initial={{ opacity: 0, x: isLeft ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`flex justify-center ${isLeft ? "order-2" : "order-1"}`}
                >
                    <img
                        src={image}
                        alt={title}
                        className="max-h-[550px] object-contain"
                    />
                </motion.div>

            </div>
        </section>
    );
}

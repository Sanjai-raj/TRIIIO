import { AnimatePresence, motion } from 'framer-motion';
import { PLACEHOLDER_IMG } from '../../constants';
import { useState } from "react";
import { FaTimes } from "react-icons/fa";


interface ImageZoomModalProps {
    open: boolean;
    image: string;
    onClose: () => void;
}

export default function ImageZoomModal({ open, image, onClose }: ImageZoomModalProps) {
    const [scale, setScale] = useState(1);

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/90 z-[2000] backdrop-blur-sm"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    <div className="fixed top-4 right-4 z-[2002]">
                        <button
                            onClick={onClose}
                            className="p-2 bg-black/50 text-white rounded-full hover:bg-black/80 transition"
                        >
                            <FaTimes size={24} />
                        </button>
                    </div>

                    <motion.div
                        className="fixed inset-0 z-[2001] flex items-center justify-center overflow-hidden"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) onClose();
                        }}
                    >
                        <motion.img
                            src={image || PLACEHOLDER_IMG}
                            alt="Zoomed Product"
                            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl scale-125 transition-transform duration-300"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = PLACEHOLDER_IMG;
                            }}
                            drag
                            dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
                            dragElastic={0.1}
                            onDoubleClick={() => setScale(scale === 1 ? 2.5 : 1)}
                            style={{ scale }}
                            onWheel={(e) =>
                                setScale(Math.min(Math.max(1, scale + e.deltaY * -0.001), 4))
                            }
                        // Reset scale when drag ends if we want, or keep it. 
                        // Keeping it allows panning while zoomed.
                        />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

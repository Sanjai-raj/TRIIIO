import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from 'react-icons/fa';

interface SizeGuideSheetProps {
    open: boolean;
    onClose: () => void;
}

export default function SizeGuideSheet({ open, onClose }: SizeGuideSheetProps) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Sheet */}
                    <motion.div
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl p-6 z-[101] shadow-xl max-h-[80vh] overflow-y-auto"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        drag="y"
                        dragConstraints={{ top: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(_, info) => {
                            if (info.offset.y > 100) onClose();
                        }}
                    >
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Size Guide</h3>
                            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 text-left">
                                        <th className="p-3 rounded-tl-lg">Size</th>
                                        <th className="p-3">Chest (in)</th>
                                        <th className="p-3 rounded-tr-lg">Length (in)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-gray-600">
                                    <tr>
                                        <td className="p-3 font-bold text-gray-900">S</td>
                                        <td className="p-3">38"</td>
                                        <td className="p-3">28"</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-bold text-gray-900">M</td>
                                        <td className="p-3">40"</td>
                                        <td className="p-3">29"</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-bold text-gray-900">L</td>
                                        <td className="p-3">42"</td>
                                        <td className="p-3">30"</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-bold text-gray-900">XL</td>
                                        <td className="p-3">44"</td>
                                        <td className="p-3">31"</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-bold text-gray-900">XXL</td>
                                        <td className="p-3">46"</td>
                                        <td className="p-3">32"</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <button
                            onClick={onClose}
                            className="mt-8 w-full py-3.5 border border-gray-200 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 active:scale-[0.98] transition-all"
                        >
                            Close
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

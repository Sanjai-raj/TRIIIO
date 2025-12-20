import React from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { SIZES } from '../../src/constants'; // Assuming SIZES is in constants, otherwise copied from ProductForm logic

interface Variant {
    size: string;
    stock: number;
}

interface InventoryCompactProps {
    variants: Variant[];
    setVariants: (variants: Variant[]) => void;
    stock: number;
}

const InventoryCompact: React.FC<InventoryCompactProps> = ({ variants, setVariants, stock }) => {

    const handleVariantChange = (size: string, stock: number) => {
        const existing = variants.find(v => v.size === size);
        if (existing) {
            setVariants(variants.map(v => v.size === size ? { ...v, stock } : v));
        } else {
            setVariants([...variants, { size, stock }]);
        }
    };

    const removeVariant = (size: string) => {
        setVariants(variants.filter(v => v.size !== size));
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <label className="block font-bold text-sm text-gray-800">Inventory</label>
                    <p className="text-[11px] text-gray-500">Manage stock by size.</p>
                </div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                    Total: <span className="text-[#008B9E] text-sm ml-1">{stock}</span>
                </div>
            </div>

            {/* Desktop Table View */}
            <table className="min-w-full divide-y divide-gray-200 hidden md:table">
                <thead className="bg-gray-50/50">
                    <tr>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider w-24">Size</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider w-32">Status</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Available Qty</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {SIZES.map(size => {
                        const variant = variants.find(v => v.size === size);
                        const isSelected = !!variant;

                        return (
                            <tr key={size} className={isSelected ? 'bg-white' : 'bg-gray-50/20'}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                                    {size}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={isSelected}
                                            onChange={() => isSelected ? removeVariant(size) : handleVariantChange(size, 0)}
                                        />
                                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#008B9E]"></div>
                                    </label>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="max-w-[120px]">
                                        {isSelected ? (
                                            <input
                                                type="number"
                                                min="0"
                                                className="w-full border border-gray-300 h-9 px-3 rounded-md text-sm font-bold focus:ring-2 focus:ring-[#008B9E] focus:border-transparent focus:outline-none bg-white text-gray-900"
                                                value={variant.stock}
                                                onChange={(e) => handleVariantChange(size, parseInt(e.target.value) || 0)}
                                            />
                                        ) : (
                                            <span className="text-xs text-gray-400 italic pl-1">Unavailable</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Mobile Stacked View */}
            <div className="block md:hidden divide-y divide-gray-100">
                {SIZES.map(size => {
                    const variant = variants.find(v => v.size === size);
                    const isSelected = !!variant;

                    return (
                        <div key={size} className={`p-4 flex items-center justify-between transition-colors ${isSelected ? 'bg-white' : 'bg-gray-50/50'}`}>
                            {/* Size Label */}
                            <div className="flex flex-col w-12">
                                <span className="font-bold text-gray-900 text-lg">{size}</span>
                            </div>

                            {/* Quantity Input */}
                            <div className="flex-1 mx-4">
                                {isSelected ? (
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        className="w-full border border-gray-300 h-11 rounded-md text-lg font-bold focus:ring-2 focus:ring-[#008B9E] focus:border-transparent focus:outline-none text-center shadow-sm"
                                        value={variant.stock}
                                        onChange={(e) => handleVariantChange(size, parseInt(e.target.value) || 0)}
                                    />
                                ) : (
                                    <div className="h-11 flex items-center justify-center text-xs text-gray-400 italic border border-dashed border-gray-200 rounded-md">
                                        -
                                    </div>
                                )}
                            </div>

                            {/* Toggle Checkbox */}
                            <div>
                                <input
                                    type="checkbox"
                                    className="w-6 h-6 rounded border-gray-300 text-[#008B9E] focus:ring-[#008B9E]"
                                    checked={isSelected}
                                    onChange={() => isSelected ? removeVariant(size) : handleVariantChange(size, 0)}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default InventoryCompact;

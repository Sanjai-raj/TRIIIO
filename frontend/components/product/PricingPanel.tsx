import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';

interface PricingPanelProps {
    formData: any;
    setFormData: (data: any) => void;
}

const PricingPanel: React.FC<PricingPanelProps> = ({ formData, setFormData }) => {
    const { formatPrice } = useCurrency();
    const inputClasses = "w-full border border-gray-200 h-11 rounded-md focus:ring-2 focus:ring-[#008B9E] focus:border-transparent focus:outline-none font-bold text-gray-700 transition hover:border-gray-300 placeholder-gray-300";

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
            <label className="block text-xs font-bold uppercase tracking-widest mb-4 text-gray-800 border-b pb-2">Pricing Strategy</label>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                {/* Price Field */}
                <div className="relative w-full">
                    <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1.5">Base Price</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                        <input
                            type="number"
                            inputMode="decimal"
                            required
                            placeholder="0.00"
                            className={`${inputClasses} pl-8`}
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                        />
                    </div>
                </div>

                {/* Discount Field */}
                <div className="w-full">
                    <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1.5">Discount %</label>
                    <div className="relative">
                        <input
                            type="number"
                            inputMode="decimal"
                            placeholder="0"
                            className={`${inputClasses} pr-8 text-center`}
                            value={formData.discount}
                            onChange={e => setFormData({ ...formData, discount: Number(e.target.value) })}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                    </div>
                </div>
            </div>

            {/* Calculation Summary */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 text-xs">Original Price</span>
                    <span className="font-semibold text-gray-700">{formData.price > 0 ? formatPrice(formData.price) : '₹0.00'}</span>
                </div>
                {formData.discount > 0 && (
                    <div className="flex justify-between items-center text-sm text-green-600">
                        <span className="text-xs">Savings</span>
                        <span className="font-bold">-{formData.discount}%</span>
                    </div>
                )}
                <div className="border-t border-gray-200 my-1"></div>
                <div className="flex justify-between items-center">
                    <span className="uppercase text-[10px] font-bold text-gray-400 tracking-wider">Final Price</span>
                    <span className="font-black text-xl text-[#008B9E]">
                        {formatPrice(formData.price * (1 - (formData.discount / 100)))}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PricingPanel;

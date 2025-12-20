import React from 'react';
import { CATEGORIES, COLORS } from '../../src/constants';

interface DescriptionBoxProps {
    formData: any;
    setFormData: (data: any) => void;
    toggleArrayItem: (key: string, value: string) => void;
}

const DescriptionBox: React.FC<DescriptionBoxProps> = ({ formData, setFormData, toggleArrayItem }) => {
    const inputClasses = "w-full border border-gray-200 p-3 h-11 rounded-md focus:ring-2 focus:ring-[#008B9E] focus:border-transparent focus:outline-none transition hover:border-gray-300 font-medium text-gray-700 placeholder-gray-400";
    const labelClasses = "block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500";

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <h3 className="font-bold text-lg text-gray-800 mb-6 pb-2 border-b border-gray-100">Product Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-5">
                    <div>
                        <label className={labelClasses}>Product Name</label>
                        <input required placeholder="e.g. Classic Oxford Shirt" className={inputClasses} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClasses}>Category</label>
                            <select className={`${inputClasses} bg-white`} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClasses}>Brand</label>
                            <input placeholder="e.g. TRIIIO" className={inputClasses} value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} />
                        </div>
                    </div>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className={labelClasses}>Tags</label>
                        <input placeholder="e.g. summer, cotton, slim-fit" className={inputClasses} value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} />
                    </div>

                    <div>
                        <label className={labelClasses}>Available Colors</label>
                        <div className="flex gap-2 flex-wrap">
                            {COLORS.map(c => (
                                <button
                                    type="button"
                                    key={c}
                                    onClick={() => toggleArrayItem('colors', c)}
                                    className={`h-8 px-4 rounded-full text-[11px] font-bold uppercase tracking-wide transition border ${formData.colors.includes(c) ? 'bg-[#008B9E] text-white border-[#008B9E] shadow-sm' : 'bg-white text-gray-500 border-gray-200 hover:border-[#008B9E] hover:text-[#008B9E]'}`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <label className={labelClasses}>Description</label>
                <textarea required placeholder="Detailed product description..." className="w-full border border-gray-200 p-4 rounded-md h-48 focus:ring-2 focus:ring-[#008B9E] focus:border-transparent focus:outline-none resize-y transition hover:border-gray-300 font-normal text-gray-700 placeholder-gray-400 leading-relaxed" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>
        </div>
    );
};

export default DescriptionBox;

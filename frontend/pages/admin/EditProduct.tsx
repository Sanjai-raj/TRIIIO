import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
// Layout
import AdminLayout from '../../components/layout/AdminLayout';

// Components
import DescriptionBox from '../../components/product/DescriptionBox';
import InventoryCompact from '../../components/product/InventoryCompact';
import PricingPanel from '../../components/product/PricingPanel';
import { FaTrash } from 'react-icons/fa';

const EditProduct: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        discount: 0,
        category: 'Men',
        brand: '',
        stock: 0,
        images: [],
        colors: [] as string[],
        tags: '',
    });

    const [variants, setVariants] = useState<{ size: string; stock: number }[]>([]);
    const [images, setImages] = useState<FileList | null>(null);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<{ url: string; publicId: string }[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            api.get(`/products/${id}`).then(res => {
                const p = res.data;

                setFormData({
                    name: p.name,
                    description: p.description,
                    price: p.price || 0,
                    discount: p.discount || 0,
                    category: p.category,
                    brand: p.brand,
                    stock: p.countInStock || p.stock || 0, // Fallback to stock if countInStock missing
                    images: p.images || [],
                    colors: p.colors || [],
                    tags: p.tags ? (Array.isArray(p.tags) ? p.tags.join(', ') : p.tags) : '',
                });
                setVariants(p.variants || []);
                setExistingImages(p.images || []);
            }).catch(err => {
                console.error(err);
                toast.error('Failed to load product');
            }).finally(() => setLoading(false));
        }
    }, [id, isEdit]);

    // Recalculate total stock whenever variants change
    useEffect(() => {
        const totalStock = variants.reduce((acc, curr) => acc + curr.stock, 0);
        setFormData(prev => ({ ...prev, stock: totalStock }));
    }, [variants]);

    const toggleArrayItem = (key: string, value: string) => {
        // @ts-ignore
        const array = formData[key] as string[];
        if (array.includes(value)) {
            setFormData({ ...formData, [key]: array.filter(item => item !== value) });
        } else {
            setFormData({ ...formData, [key]: [...array, value] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();

            // Basic fields
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price.toString());
            data.append('discount', formData.discount.toString());
            data.append('category', formData.category);
            data.append('brand', formData.brand);
            data.append('stock', formData.stock.toString());

            // Complex fields handled safely as JSON strings
            data.append('colors', JSON.stringify(formData.colors));
            data.append('variants', JSON.stringify(variants));

            // Handle tags split
            const tagsArray = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
            data.append('tags', JSON.stringify(tagsArray));

            // Append New Images
            if (images) {
                Array.from(images).forEach((img) => {
                    data.append('images', img);
                });
            }

            // Update / Create Logic
            if (isEdit) {
                data.append('existingImages', JSON.stringify(existingImages));

                await api.put(`/products/${id}`, data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                toast.success('Product updated!');
            } else {
                await api.post('/products', data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                toast.success('Product created!');
            }
            navigate('/admin/products');
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Error saving product');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEdit && !formData.name) return <div className="p-10 text-center">Loading...</div>;

    return (
        <AdminLayout>
            <form onSubmit={handleSubmit}>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
                        <p className="text-sm text-gray-500">Manage product details, pricing, and inventory.</p>
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={() => navigate('/admin/products')} className="px-4 py-2 border border-gray-300 rounded-sm text-sm font-bold bg-white text-gray-700 hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-6 py-2 bg-[#008B9E] text-white rounded-sm text-sm font-bold shadow-md hover:bg-[#007A8A] disabled:opacity-50">
                            {loading ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap -mx-3 pb-24 lg:pb-0"> {/* Row with padding for mobile sticky bar */}
                    {/* Left Column: Description & Inventory */}
                    <div className="w-full lg:w-2/3 px-3 mb-6"> {/* Col-lg-8 */}
                        <DescriptionBox
                            formData={formData}
                            setFormData={setFormData}
                            toggleArrayItem={toggleArrayItem}
                        />

                        {/* Product Images Section */}
                        <div className="bg-white rounded-lg border p-4 mb-6 shadow-sm">
                            <h3 className="text-sm font-semibold mb-3">Product Images</h3>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                    const files = e.target.files;
                                    setImages(files);
                                    if (files) {
                                        const previews = Array.from(files).map((file) => URL.createObjectURL(file));
                                        setPreviewImages(previews);
                                    }
                                }}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                            />
                            <p className="text-xs text-gray-400 mt-2">Upload up to 5 images. First image will be used as the product thumbnail.</p>

                            {/* Existing Images */}
                            {isEdit && existingImages.length > 0 && (
                                <div className="grid grid-cols-5 gap-3 mt-4">
                                    {existingImages.map((img, index) => (
                                        <div key={index} className="relative group">
                                            <img src={img.url} className="h-24 w-full object-cover rounded border" alt="saved" />
                                            <button type="button" onClick={() => setExistingImages(prev => prev.filter((_, i) => i !== index))} className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"><FaTrash size={10} /></button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* New Previews */}
                            {previewImages.length > 0 && (
                                <div className="grid grid-cols-5 gap-3 mt-4">
                                    {previewImages.map((src, index) => (
                                        <img key={index} src={src} className="h-24 w-full object-cover rounded border" alt="preview" />
                                    ))}
                                </div>
                            )}
                        </div>
                        <InventoryCompact
                            variants={variants}
                            setVariants={setVariants}
                            stock={formData.stock}
                        />
                    </div>

                    {/* Right Column: Pricing & Organization */}
                    <div className="w-full lg:w-1/3 px-3 mb-6"> {/* Col-lg-4 */}
                        <PricingPanel
                            formData={formData}
                            setFormData={setFormData}
                        />
                        {/* Placeholder for future Organization Card or Publish Status if needed */}
                    </div>
                </div>

                {/* Sticky Save Bar (Mobile Only) */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#008B9E] text-white py-3 rounded-md text-base font-bold shadow-sm hover:bg-[#007A8A] disabled:opacity-50 min-h-[48px]"
                    >
                        {loading ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
};

export default EditProduct;

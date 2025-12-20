import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../src/api/client';
import { SIZES, COLORS, CATEGORIES } from '../../src/constants';
import { FaCamera, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { ProductVariant } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';

const ProductForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '', description: '', price: 0, stock: 0, category: 'Casual',
    brand: '', tags: '' as string,
    colors: [] as string[], discount: 0
  });

  // Size Variants State
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // Store uploaded image files before sending
  const [images, setImages] = useState<FileList | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  // Keep existingImages for Edit mode compatibility, although user didn't specify it, logic needs it to not break
  const [existingImages, setExistingImages] = useState<{ url: string; publicId: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`/products/${id}`).then(res => {
        const p = res.data;

        const priceInINR = p.price || 0;

        setFormData({
          name: p.name, description: p.description,
          price: priceInINR, // Display as INR
          stock: p.stock,
          category: p.category,
          brand: p.brand || '',
          tags: p.tags ? p.tags.join(', ') : '',
          colors: p.colors,
          discount: p.discount || 0
        });

        // Handle Variants
        if (p.variants && p.variants.length > 0) {
          setVariants(p.variants);
        } else if (p.sizes && p.sizes.length > 0) {
          // Backwards compatibility for old products without variants
          const estimatedStockPerSize = Math.floor(p.stock / p.sizes.length);
          setVariants(p.sizes.map((s: string) => ({ size: s, stock: estimatedStockPerSize })));
        } else {
          setVariants([]);
        }

        setExistingImages(p.images || []);
      });
    }
  }, [id]);

  // Recalculate total stock whenever variants change
  useEffect(() => {
    const total = variants.reduce((acc, v) => acc + v.stock, 0);
    setFormData(prev => ({ ...prev, stock: total }));
  }, [variants]);



  const toggleArrayItem = (field: 'colors', value: string) => {
    setFormData(prev => {
      const current = prev[field];
      const updated = current.includes(value)
        ? current.filter(i => i !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleVariantChange = (size: string, stock: number) => {
    setVariants(prev => {
      const exists = prev.find(v => v.size === size);
      if (exists) {
        return prev.map(v => v.size === size ? { ...v, stock: Math.max(0, stock) } : v);
      }
      return [...prev, { size, stock: Math.max(0, stock) }];
    });
  };

  const removeVariant = (size: string) => {
    setVariants(prev => prev.filter(v => v.size !== size));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { name, description, price, discount, category, brand, stock: totalStock, colors, tags: tagsString } = formData;
    const tags = tagsString.split(',').map(t => t.trim()).filter(Boolean);

    const data = new FormData();

    data.append("name", name);
    data.append("description", description);
    data.append("price", price.toString());
    data.append("discount", discount.toString());
    data.append("category", category);
    data.append("brand", brand);
    data.append("stock", totalStock.toString());

    data.append("colors", JSON.stringify(colors));
    data.append("variants", JSON.stringify(variants));
    data.append("tags", JSON.stringify(tags));

    if (images) {
      Array.from(images).forEach((img) => {
        data.append("images", img);
      });
    }

    try {
      if (isEdit) {
        data.append("existingImages", JSON.stringify(existingImages));
        await api.put(`/products/${id}`, data, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product updated successfully");
      } else {
        await api.post("/products", data, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product added successfully");
      }
      navigate('/admin/products');
    } catch (err: any) {
      console.error(err);
      alert(isEdit ? "Product update failed" : "Product creation failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-sm shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-[#008B9E]">{isEdit ? 'Edit Product' : 'Create Product'}</h2>
        <Link to="/admin/products" className="text-gray-400 hover:text-gray-600 font-bold uppercase text-xs tracking-wide">Cancel</Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* SECTION 1: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Product Name</label>
              <input required placeholder="e.g. Classic Oxford Shirt" className="w-full border p-3 rounded-sm focus:border-[#008B9E] focus:outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Category</label>
                <select className="w-full border p-3 rounded-sm focus:border-[#008B9E] focus:outline-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Brand</label>
                <input placeholder="e.g. TRIIIO" className="w-full border p-3 rounded-sm focus:border-[#008B9E] focus:outline-none" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Tags (comma separated)</label>
              <input placeholder="e.g. summer, cotton, slim-fit" className="w-full border p-3 rounded-sm focus:border-[#008B9E] focus:outline-none" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} />
            </div>
            {/* Shopify Pattern: Price + Inline Discount + Calc */}
            {/* Shopify Pattern: Price + Inline Discount + Calc */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Pricing and Discount</label>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Price Field with Prefix */}
                <div className="relative flex-1 w-full">
                  <div className="flex items-center gap-1 mb-1">
                    <label className="block text-[10px] text-gray-400 font-bold uppercase">Price</label>
                    <sup className="text-gray-400 cursor-help text-[9px]" title="This is the base price shown before any promotional discounts are applied.">[?]</sup>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                    <input
                      type="number"
                      required
                      placeholder="0.00"
                      className="w-full border p-3 pl-8 rounded-sm focus:border-[#008B9E] focus:outline-none font-bold text-gray-700"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Enter the original price before discount.</p>
                </div>

                {/* Discount Field */}
                <div className="w-full md:w-40">
                  <div className="flex items-center gap-1 mb-1">
                    <label className="block text-[10px] text-gray-400 font-bold uppercase">Discount (%)</label>
                    <sup className="text-gray-400 cursor-help text-[9px]" title="Discount will be deducted from the original price to calculate the final selling price.">[?]</sup>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full border p-3 pr-8 rounded-sm focus:border-[#008B9E] focus:outline-none font-bold text-gray-700 text-center"
                      value={formData.discount}
                      onChange={e => setFormData({ ...formData, discount: Number(e.target.value) })}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Optional. Applied to the original price.</p>
                </div>
              </div>

              {/* Calculation Summary */}
              <div className="mt-4 bg-gray-50 p-4 rounded-sm border border-gray-100 flex justify-between items-center text-sm">
                <div className="text-gray-500 flex flex-col">
                  <div>
                    <span className="line-through mr-2">{formData.price > 0 ? formatPrice(formData.price) : '₹0.00'}</span>
                    <span className="text-red-500 font-bold">-{formData.discount}%</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="uppercase text-[10px] font-bold text-gray-400 tracking-wider">Final Selling Price</span>
                  <span className="font-black text-lg text-[#008B9E]">
                    {formatPrice(formData.price * (1 - (formData.discount / 100)))}
                  </span>
                  <p className="text-[9px] text-gray-400">Automatically calculated after discount.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Description</label>
            <textarea required placeholder="Detailed product description..." className="w-full border p-3 rounded-sm h-64 focus:border-[#008B9E] focus:outline-none resize-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          </div>
        </div>

        <div className="border-t border-gray-100 my-8"></div>

        <div className="bg-white rounded-lg border p-4 mb-6">
          <h3 className="text-sm font-semibold mb-3">Product Images</h3>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = e.target.files;
              setImages(files);

              if (files) {
                const previews = Array.from(files).map((file) =>
                  URL.createObjectURL(file)
                );
                setPreviewImages(previews);
              }
            }}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-teal-50 file:text-teal-700
              hover:file:bg-teal-100"
          />
          <p className="text-xs text-gray-400 mt-2">
            Upload up to 5 images. First image will be used as the product thumbnail.
          </p>

          {/* Existing Images (Edit Mode) */}
          {isEdit && existingImages.length > 0 && (
            <div className="grid grid-cols-5 gap-3 mb-4">
              {existingImages.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img.url}
                    className="h-24 w-full object-cover rounded border"
                    alt="saved"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setExistingImages(prev =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    title="Remove Image"
                  >
                    <FaTrash size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* New Image Preview */}
          {previewImages.length > 0 && (
            <div className="grid grid-cols-5 gap-3 mt-4">
              {previewImages.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  className="h-24 w-full object-cover rounded border"
                  alt="preview"
                />
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 my-8"></div>

        {/* SECTION: Variants & Stock */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block font-bold text-lg text-[#008B9E]">Inventory & Variants</label>
            <div className="text-xs uppercase tracking-widest font-bold text-gray-500">Total Stock: <span className="text-[#008B9E] text-lg">{formData.stock}</span></div>
          </div>
          <p className="text-xs text-gray-400 mb-4">Manage available stock for each size.</p>

          <div className="bg-white p-0 rounded-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-32">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-40">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Available Quantity
                    <sup className="text-gray-400 cursor-help ml-1" title="Set to 0 to mark this size as out of stock.">[?]</sup>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {SIZES.map(size => {
                  const variant = variants.find(v => v.size === size);
                  const isSelected = !!variant;

                  return (
                    <tr key={size} className={isSelected ? 'bg-white' : 'bg-gray-50/50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isSelected}
                            onChange={() => isSelected ? removeVariant(size) : handleVariantChange(size, 0)}
                          />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#008B9E]"></div>
                          <span className="ms-3 text-xs font-medium text-gray-900">{isSelected ? 'Enabled' : 'Disabled'}</span>
                        </label>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="max-w-[150px]">
                          {isSelected ? (
                            <>
                              <input
                                type="number"
                                min="0"
                                title="Enter the number of items available for this size."
                                className="w-full border p-2 rounded-sm text-sm font-bold focus:border-[#008B9E] focus:outline-none bg-white text-gray-900"
                                value={variant.stock}
                                onChange={(e) => handleVariantChange(size, parseInt(e.target.value) || 0)}
                              />
                            </>
                          ) : (
                            <span className="text-xs text-gray-400 italic">Size disabled — enable to add stock</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 3: Colors */}
        <div>
          <label className="block font-bold mb-2 text-sm uppercase text-gray-500">Available Colors</label>
          <div className="flex gap-3 flex-wrap">
            {COLORS.map(c => (
              <button
                type="button"
                key={c}
                onClick={() => toggleArrayItem('colors', c)}
                className={`px-4 py-2 border rounded-full text-xs font-bold uppercase tracking-wide transition ${formData.colors.includes(c) ? 'bg-[#008B9E] text-white border-[#008B9E]' : 'bg-white text-gray-500 hover:border-[#008B9E] hover:text-[#008B9E]'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 my-8"></div>

        {/* SECTION 4: Images Moved Up */}

        <div className="pt-8 border-t border-gray-100 flex justify-end">
          <button disabled={loading} className="bg-[#008B9E] text-white px-10 py-4 rounded-sm font-bold hover:bg-[#006D7C] uppercase tracking-widest shadow-lg transform active:scale-95 transition">
            {loading ? 'Processing...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import api from '../services/api';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { SIZES, COLORS, CATEGORIES, PLACEHOLDER_IMG } from '../constants';
import { FaFilter, FaChevronDown, FaTimes } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import { useCart } from '../context/CartContext';

const iconAnim = "transition-transform duration-200 ease-out hover:scale-110 active:scale-95";

import { SortBy } from '../components/SortBy';

const Shop: React.FC = () => {
  // ... (rest of state code same as before) ...
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const search = searchParams.get('search') || '';
  const selectedSize = searchParams.get('size') || '';
  const selectedColor = searchParams.get('color') || '';
  const selectedCategory = searchParams.get('category') || '';
  const selectedPriceRange = searchParams.get('price') || '';
  const sort = searchParams.get('sort') || '';

  // ... (useEffect and fetches same) ...

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const apiParams = new URLSearchParams();
      if (search) apiParams.append('search', search);
      if (selectedSize) apiParams.append('size', selectedSize);
      if (selectedColor) apiParams.append('color', selectedColor);
      if (selectedCategory) apiParams.append('category', selectedCategory);
      if (sort) apiParams.append('sort', sort);

      if (selectedPriceRange) {
        if (selectedPriceRange.includes('+')) {
          const min = selectedPriceRange.replace('+', '');
          apiParams.append('minPrice', min);
        } else {
          const [min, max] = selectedPriceRange.split('-');
          if (min) apiParams.append('minPrice', min);
          if (max) apiParams.append('maxPrice', max);
        }
      }

      const res = await api.get(`/products?${apiParams.toString()}`);
      setProducts(res.data.products || res.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load products", 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 min-h-screen">

      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-serif font-black mb-4 tracking-tight text-gray-900">
          The Collection
        </h1>
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-100 pb-6">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">
            Discover {products.length} premium items
          </p>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              className="md:hidden flex items-center gap-2 bg-gray-100 px-4 py-3 uppercase text-xs font-bold w-1/2 justify-center hover:bg-[#008B9E] hover:text-white transition rounded-sm"
              onClick={() => setShowFilters(true)}
            >
              <FaFilter /> Filters
            </button>
            <div className="w-1/2 md:w-auto">
              <SortBy sort={sort} onSortChange={(val) => updateFilter('sort', val)} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-16 relative">

        {/* Filters Sidebar (Mobile: Fixed, Desktop: Sticky) */}
        <aside className={`fixed inset-0 bg-white z-[1300] p-6 overflow-auto transition-transform duration-300 md:sticky md:top-24 md:h-fit md:p-0 md:w-64 md:block md:translate-x-0 md:z-10 md:overflow-visible ${showFilters ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center mb-10 md:hidden">
            <h2 className="text-xl font-black uppercase tracking-tighter">Filters</h2>
            <button onClick={() => setShowFilters(false)}><FaTimes size={20} /></button>
          </div>

          <div className="space-y-10">
            <div>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="SEARCH..."
                  className="w-full border-b border-gray-200 py-2 pr-4 focus:outline-none focus:border-[#008B9E] text-xs tracking-widest uppercase placeholder-gray-300 font-bold bg-transparent"
                  value={search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                />
                <FaChevronDown className="absolute right-0 top-3 text-gray-300 text-[10px] -rotate-90 pointer-events-none" />
              </form>
            </div>

            <div className="space-y-8">
              {/* Category */}
              <div>
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-gray-900">Category</h4>
                  {selectedCategory && <button onClick={() => updateFilter('category', '')} className="text-[10px] text-gray-400 hover:text-[#008B9E] uppercase">Reset</button>}
                </div>
                <div className="space-y-2">
                  {CATEGORIES.map(c => (
                    <label key={c} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === c}
                        onChange={() => updateFilter('category', c)}
                        className="hidden"
                      />
                      <span className={`w-3 h-3 rounded-full border border-gray-300 transition ${selectedCategory === c ? 'bg-[#008B9E] border-[#008B9E]' : 'group-hover:border-[#008B9E]'}`}></span>
                      <span className={`text-xs uppercase tracking-wide transition ${selectedCategory === c ? 'text-[#008B9E] font-bold' : 'text-gray-500 group-hover:text-gray-900'}`}>{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-gray-900">Price</h4>
                  {selectedPriceRange && <button onClick={() => updateFilter('price', '')} className="text-[10px] text-gray-400 hover:text-[#008B9E] uppercase">Reset</button>}
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Under ₹4,000', value: '0-50' },
                    { label: '₹4,000 - ₹8,000', value: '50-100' },
                    { label: '₹8,000 - ₹12,000', value: '100-150' },
                    { label: 'Over ₹12,000', value: '150+' }
                  ].map(p => (
                    <label key={p.value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="price"
                        checked={selectedPriceRange === p.value}
                        onChange={() => updateFilter('price', p.value)}
                        className="hidden"
                      />
                      <span className={`w-3 h-3 rounded-full border border-gray-300 transition ${selectedPriceRange === p.value ? 'bg-[#008B9E] border-[#008B9E]' : 'group-hover:border-[#008B9E]'}`}></span>
                      <span className={`text-xs uppercase tracking-wide transition ${selectedPriceRange === p.value ? 'text-[#008B9E] font-bold' : 'text-gray-500 group-hover:text-gray-900'}`}>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-gray-900">Size</h4>
                  {selectedSize && <button onClick={() => updateFilter('size', '')} className="text-[10px] text-gray-400 hover:text-[#008B9E] uppercase">Reset</button>}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {SIZES.map(s => (
                    <button
                      key={s}
                      onClick={() => updateFilter('size', selectedSize === s ? '' : s)}
                      className={`h-10 text-[10px] font-bold transition-all duration-200 uppercase ${selectedSize === s
                        ? 'bg-[#008B9E] text-white'
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-200'
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-gray-900">Color</h4>
                  {selectedColor && <button onClick={() => updateFilter('color', '')} className="text-[10px] text-gray-400 hover:text-[#008B9E] uppercase">Reset</button>}
                </div>
                <div className="flex flex-col gap-2">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => updateFilter('color', selectedColor === c ? '' : c)}
                      className={`flex items-center gap-3 w-full py-2 px-1 text-xs uppercase tracking-wide transition-colors ${selectedColor === c ? 'text-[#008B9E] font-bold' : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                      <span className={`w-3 h-3 rounded-full border border-gray-200 shadow-sm`} style={{ backgroundColor: c.toLowerCase() }}></span>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              className="md:hidden w-full bg-[#008B9E] text-white py-4 font-bold uppercase tracking-widest text-xs mt-8"
              onClick={() => setShowFilters(false)}
            >
              View Results
            </button>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 border-t border-b border-gray-100">
              <p className="text-gray-400 uppercase tracking-widest text-sm mb-6">No matching items found</p>
              <button onClick={() => setSearchParams({})} className="bg-[#008B9E] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#006D7C] transition">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div >
  );
};
export default Shop;
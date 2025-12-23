import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { api } from '../src/api/client';
import { useSearchParams } from 'react-router-dom';
import { SIZES, COLORS, CATEGORIES } from '../src/constants';
import { FaFilter, FaChevronDown, FaTimes } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import { useCurrency } from '../context/CurrencyContext';
import { SortBy } from '../components/SortBy';

const Shop: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [showFilters, setShowFilters] = useState(false);
  const search = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || '';
  const selectedSize = searchParams.get('size') || '';
  const selectedColor = searchParams.get('color') || '';
  const sortBy = searchParams.get('sort') || 'newest';
  const selectedPriceRange = searchParams.get('price') || '';



  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const apiParams = new URLSearchParams(searchParams);
      console.log("QUERY STRING SENT:", apiParams.toString());
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
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams);
  };

  return (
    // Changed "container mx-auto" to "w-full" and used px-4 for consistent side padding
    <div className="w-full px-4 md:px-8 py-6 bg-white">

      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-gray-900 mb-2">
          The Collection
        </h1>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-100 pb-4">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">
            Discover {products.length} Premium Items
          </p>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              className="md:hidden flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 uppercase text-[10px] font-bold tracking-widest flex-1 rounded-sm"
              onClick={() => setShowFilters(true)}
            >
              <FaFilter size={10} /> Filters
            </button>
            <div className="flex-1 md:w-48">
              <SortBy sort={sortBy} onSortChange={(val) => updateFilter('sort', val)} />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-10">

        {/* Sidebar Filters */}
        <aside className={`
          fixed inset-0 bg-white z-[1300] p-6 transition-transform duration-300 md:relative md:inset-auto 
          md:translate-x-0 md:z-10 md:p-0 md:w-52 lg:w-60 shrink-0
          ${showFilters ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex justify-between items-center mb-8 md:hidden border-b pb-4">
            <h2 className="text-lg font-black uppercase tracking-tighter">Filters</h2>
            <button onClick={() => setShowFilters(false)} className="p-2"><FaTimes size={20} /></button>
          </div>

          <div className="space-y-10 sticky top-10">
            {/* Search */}
            <div className="relative group">
              <input
                type="text"
                placeholder="SEARCH..."
                className="w-full border-b border-gray-200 py-2 text-[11px] font-bold tracking-widest uppercase focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-300"
                value={search}
                onChange={(e) => updateFilter('search', e.target.value)}
              />
              <FaChevronDown className="absolute right-0 top-3 text-gray-300 text-[10px] -rotate-90" />
            </div>

            {/* Filter Sections */}
            <div className="space-y-8">
              <FilterGroup title="Category" active={!!selectedCategory} onReset={() => updateFilter('category', '')}>
                <div className="space-y-2.5">
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      onClick={() => updateFilter('category', c)}
                      className={`flex items-center gap-3 w-full group text-left`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full border transition-all ${selectedCategory === c ? 'bg-black border-black scale-110' : 'border-gray-300 group-hover:border-black'}`}></span>
                      <span className={`text-[12px] uppercase tracking-widest transition-colors ${selectedCategory === c ? 'text-black font-bold' : 'text-gray-600 group-hover:text-black'}`}>{c}</span>
                    </button>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup title="Price" active={!!selectedPriceRange} onReset={() => updateFilter('price', '')}>
                <div className="space-y-2.5">
                  {[
                    { label: 'Under ₹300', value: '0-300' },
                    { label: '₹300 - ₹600', value: '300-600' },
                    { label: 'Over ₹600', value: '600+' }
                  ].map(p => (
                    <button
                      key={p.value}
                      onClick={() => updateFilter('price', p.value)}
                      className="flex items-center gap-3 w-full group text-left"
                    >
                      <span className={`w-2.5 h-2.5 rounded-full border transition-all ${selectedPriceRange === p.value ? 'bg-black border-black scale-110' : 'border-gray-300 group-hover:border-black'}`}></span>
                      <span className={`text-[12px] uppercase tracking-widest transition-colors ${selectedPriceRange === p.value ? 'text-black font-bold' : 'text-gray-600 group-hover:text-black'}`}>{p.label}</span>
                    </button>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup title="Size" active={!!selectedSize} onReset={() => updateFilter('size', '')}>
                <div className="grid grid-cols-3 gap-1.5">
                  {SIZES.map(s => (
                    <button
                      key={s}
                      onClick={() => updateFilter('size', selectedSize === s ? '' : s)}
                      className={`h-9 text-[12px] font-bold border transition-all uppercase ${selectedSize === s ? 'bg-black text-white border-black' : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-300'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </FilterGroup>
            </div>

            <button
              className="md:hidden w-full bg-black text-white py-4 font-bold uppercase tracking-[0.2em] text-[10px] mt-8 shadow-xl"
              onClick={() => setShowFilters(false)}
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-lg">
              <p className="text-gray-400 uppercase tracking-widest text-[11px] mb-4 font-bold">No items found</p>
              <button onClick={() => setSearchParams({})} className="text-black text-[10px] font-black border-b border-black uppercase pb-1 tracking-widest">
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Sub-component for clean filter groups
const FilterGroup = ({ title, children, active, onReset }: any) => (
  <div className="border-b border-gray-50 pb-6">
    <div className="flex justify-between items-center mb-4">
      <h4 className="font-extrabold text-[12px] uppercase tracking-[0.25em] text-black">{title}</h4>
      {active && <button onClick={onReset} className="text-[9px] text-gray-400 uppercase font-black hover:text-black">Reset</button>}
    </div>
    {children}
  </div>
);

export default Shop;
import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import { PLACEHOLDER_IMG } from '../src/constants';
import { getImageUrl } from '../utils/imageUtils';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';

const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-20 bg-white">
        <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight">Your Wishlist is Empty</h2>
        <p className="text-gray-500 mb-6 text-sm">Save items you love to buy later.</p>
        <Link to="/shop" className="text-[#008B9E] underline hover:text-[#006D7C] font-bold uppercase tracking-wide text-xs">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-serif font-black mb-10 tracking-tight text-[#008B9E]">My Wishlist</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {wishlist.map(product => (
          <div key={product._id} className="group border border-gray-100 bg-white hover:shadow-lg transition duration-300">
            <Link to={`/product/${product._id}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-50">
              <img
                src={getImageUrl(product)}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Overlay Actions */}
              <div className="absolute top-2 right-2 z-10">
                <button
                  onClick={(e) => { e.preventDefault(); removeFromWishlist(product._id); }}
                  className="bg-white/90 p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-white shadow-sm transition"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </Link>

            <div className="p-4 text-center">
              <Link to={`/product/${product._id}`}>
                <h3 className="font-serif font-bold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-[#008B9E] font-bold text-sm mb-4">${product.price}</p>
              </Link>

              <Link
                to={`/product/${product._id}`}
                className="block w-full border border-[#008B9E] text-[#008B9E] py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-[#008B9E] hover:text-white transition flex items-center justify-center gap-2"
              >
                <FaShoppingCart size={12} /> Select Options
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
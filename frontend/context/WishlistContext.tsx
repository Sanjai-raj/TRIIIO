import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { useAuth } from './AuthContext';
import { api } from '../src/api/client';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    if (user) {
      api.get('/api/wishlist')
        .then(res => {
          // Backend: { user, products: [Product] }
          setWishlist(res.data.products || []);
        })
        .catch(err => console.error(err));
    } else {
      setWishlist([]);
    }
  }, [user]);

  const addToWishlist = async (product: Product) => {
    if (!user) return;
    try {
      const res = await api.post('/api/wishlist/toggle', { productId: product._id });
      setWishlist(res.data.products);
      showToast('Added to wishlist', 'success');
    } catch (e) { console.error(e); }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;
    try {
      const res = await api.post('/api/wishlist/toggle', { productId });
      setWishlist(res.data.products);
      showToast('Removed from wishlist', 'success');
    } catch (e) { console.error(e); }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p._id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};
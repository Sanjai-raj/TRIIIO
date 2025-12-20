import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { api } from '../src/api/client';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, size: string, color: string) => void;
  removeFromCart: (productId: string, size: string, color: string) => void; // frontend signature: actually we delete by ID if possible, but frontend uses product+size+color to identify. I added `_id` to cart items in backend? Yes, inside `items` array.
  // Wait, backend delete uses `itemId` (subdocument ID).
  // Frontend `removeFromCart` currently takes product details. I'll need to find the `_id` of the item to delete it via API.
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  // Fetch Cart on Login
  useEffect(() => {
    if (user) {
      api.get('/cart')
        .then(res => {
          // Backend returns: { _id, user, items: [{ product, quantity, ... }] }
          // Frontend expects: items array directly?
          // Existing frontend used `items` state as the array.
          // Backend: items: [ { product: {...}, quantity: 1, ... } ]
          // So we set items to res.data.items
          setItems(res.data.items || []);
        })
        .catch(err => console.error("Failed to fetch cart", err));
    } else {
      setItems([]);
    }
  }, [user]);

  const addToCart = async (product: Product, quantity: number, size: string, color: string) => {
    if (!user) return; // Guests cannot add to cart

    try {
      const res = await api.post('/cart/add', {
        productId: product._id,
        quantity,
        size,
        color
      });
      setItems(res.data.items);
      showToast('Added to cart', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to add to cart', 'error');
    }
  };

  const removeFromCart = async (productId: string, size: string, color: string) => {
    // We need the SubDocument ID (_id) of the item to delete via API '/cart/:itemId'
    // Find it in local state
    const item = items.find(i =>
      i.product._id === productId && i.selectedSize === size && i.selectedColor === color
    );

    if (!item || !(item as any)._id) return; // Should have _id from backend

    try {
      const res = await api.delete(`/cart/${(item as any)._id}`);
      setItems(res.data.items);
      showToast('Removed from cart', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to remove item', 'error');
    }
  };

  const updateQuantity = async (productId: string, size: string, color: string, quantity: number) => {
    if (quantity < 1) return;

    const item = items.find(i =>
      i.product._id === productId && i.selectedSize === size && i.selectedColor === color
    );

    if (!item || !(item as any)._id) return;

    // Optimistic Check?
    // Or just call API. User logic had stock check.
    // Backend doesn't check stock in my simple logic but frontend can check before calling?
    // I'll keep it simple for now as requested.

    try {
      const res = await api.post('/cart/update', { itemId: (item as any)._id, quantity });
      setItems(res.data.items);
    } catch (e) {
      console.error(e);
    }
  };

  const clearCart = () => setItems([]);

  const cartTotal = items.reduce((total, item) => {
    const price = item.product.discount
      ? item.product.price - (item.product.price * (item.product.discount / 100))
      : item.product.price;
    return total + (price * item.quantity);
  }, 0);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
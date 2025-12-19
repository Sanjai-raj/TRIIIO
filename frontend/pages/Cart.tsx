import React from 'react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext'
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { PLACEHOLDER_IMG } from '../constants';
import { getImageUrl } from '../utils/imageUtils';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedButton from '../components/AnimatedButton';

const MotionDiv = motion.div as any;

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to remove all items from your cart?")) {
      clearCart();
      showToast("Cart cleared", 'info');
    }
  };

  const deliveryCharge = cartTotal > 75 ? 0 : 10;
  const finalTotal = cartTotal + deliveryCharge;

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-white">
        <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight">Your Cart is Empty</h2>
        <Link to="/shop" className="text-[#008B9E] underline hover:text-[#006D7C]">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto p-6 md:p-0 md:py-12">
      <div className="flex-1 bg-white">
        <div className="flex justify-between items-end border-b border-[#008B9E] pb-4 mb-8">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-[#008B9E]">Shopping Cart</h2>
          <button
            onClick={handleClearCart}
            className="text-[10px] uppercase tracking-widest text-red-500 hover:text-red-700 font-bold hover:underline"
          >
            Clear Cart
          </button>
        </div>

        <div className="space-y-8">
          <AnimatePresence>
            {items.map((item, idx) => (
              <MotionDiv
                key={`${item.product._id}-${idx}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-6 border-b border-gray-100 pb-8 last:border-0 last:pb-0"
              >
                {/* Product Thumbnail - Visual Clarity Enhancements */}
                <div className="w-24 h-32 bg-gray-100 flex-shrink-0 overflow-hidden rounded-sm border border-gray-200 shadow-sm">
                  <img
                    src={getImageUrl(item.product)}
                    alt={item.product.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-900 uppercase tracking-wide text-sm md:text-base">{item.product.name}</h3>
                      <span className="font-bold text-[#008B9E]">{formatPrice(item.product.price)}</span>
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[10px] uppercase tracking-widest text-gray-500 bg-gray-50 px-2 py-1 rounded-sm border border-gray-100">
                        <span className="font-bold text-gray-700">Size:</span> {item.selectedSize}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-gray-500 bg-gray-50 px-2 py-1 rounded-sm border border-gray-100 flex items-center gap-2">
                        <span className="font-bold text-gray-700">Color:</span>
                        <span className="flex items-center gap-1">
                          {item.selectedColor}
                          <span className="w-2 h-2 rounded-full border border-gray-300" style={{ backgroundColor: item.selectedColor.toLowerCase() }}></span>
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center">
                      <button onClick={() => updateQuantity(item.product._id, item.selectedSize, item.selectedColor, item.quantity - 1)} className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:border-[#008B9E] transition">-</button>
                      <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product._id, item.selectedSize, item.selectedColor, item.quantity + 1)} className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:border-[#008B9E] transition">+</button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product._id, item.selectedSize, item.selectedColor)}
                      className="text-gray-400 text-xs uppercase tracking-widest hover:text-red-600 transition flex items-center gap-2"
                    >
                      <FaTrash size={12} /> Remove
                    </button>
                  </div>
                </div>
              </MotionDiv>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="w-full lg:w-96 bg-gray-50 p-8 h-fit border border-gray-100 shadow-sm rounded-sm">
        <h3 className="font-bold text-lg uppercase tracking-wider mb-6 text-[#008B9E]">Order Summary</h3>
        <div className="space-y-4 mb-6 text-sm">
          <div className="flex justify-between border-b border-gray-200 pb-4">
            <span className="text-gray-600 uppercase text-xs tracking-wide">Subtotal</span>
            <span className="font-bold">{formatPrice(cartTotal)}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-4">
            <span className="text-gray-600 uppercase text-xs tracking-wide">Delivery</span>
            {deliveryCharge === 0 ? (
              <span className="text-green-600 font-bold uppercase text-xs">Free</span>
            ) : (
              <span className="text-gray-900 font-bold">{formatPrice(deliveryCharge)}</span>
            )}
          </div>
          {deliveryCharge > 0 && (
            <div className="text-[10px] text-gray-400 italic">
              Spend {formatPrice(75 - cartTotal)} more for free shipping
            </div>
          )}
        </div>
        <div className="flex justify-between font-black text-xl mb-8">
          <span>Total</span>
          <span className="text-[#008B9E]">{formatPrice(finalTotal)}</span>
        </div>
        <AnimatedButton
          onClick={() => navigate('/checkout')}
          className="w-full h-14 font-bold uppercase tracking-widest text-sm shadow-lg transform active:scale-95"
        >
          Proceed to Checkout
        </AnimatedButton>
      </div>
    </div>
  );
};

export default Cart;
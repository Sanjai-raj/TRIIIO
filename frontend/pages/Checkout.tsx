import React, { useState, useEffect } from 'react';
import { sendOrderToWhatsApp } from '../utils/sendOrderToWhatsApp';
import { generateOrderId } from '../utils/generateOrderId';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { api } from '../src/api/client';
import { useToast } from '../context/ToastContext';
import { Address } from '../types';
import AnimatedButton from '../components/AnimatedButton';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout: React.FC = () => {
  const { cartTotal, items, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  if (!user) return <Navigate to="/login" />;
  if (items.length === 0) return <Navigate to="/cart" />;

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selected, setSelected] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch addresses on mount
    api.get('/users/addresses').then(res => {
      setAddresses(res.data);
      // Auto select default
      const def = res.data.find((a: Address) => a.isDefault);
      if (def) setSelected(def);
    }).catch(err => console.error(err));
  }, []);

  const placeOrder = async () => {
    if (!selected) {
      showToast("Please select a delivery address", 'error');
      return;
    }

    setLoading(true);

    // 1. Prepare Data
    const frontendOrderId = generateOrderId();
    const totalAmountVal = cartTotal > 75 ? cartTotal : cartTotal + 10;

    const whatsappProducts = items.map((item) => ({
      name: item.product.name,
      size: item.selectedSize,
      color: item.selectedColor,
      quantity: item.quantity,
      price: item.product.price,
      image: item.product.images[0]?.url || '',
    }));

    const customerData = {
      name: selected.fullName,
      phone: selected.phone || user.phone || '',
      address: `${selected.addressLine1}, ${selected.city}, ${selected.state} - ${selected.pincode}`
    };

    const orderData = {
      orderId: frontendOrderId,
      items: items.map(i => ({
        product: i.product._id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        size: i.selectedSize,
        color: i.selectedColor,
        image: i.product.images[0]?.url
      })),
      products: whatsappProducts,
      customer: customerData,
      shippingAddress: selected,
      orderAmount: totalAmountVal,
      totalAmount: totalAmountVal,
      orderType: items.length > 1 ? "Cart Order" : "Buy Now",
      paymentMethod: 'Online'
    };

    try {
      // 2. Attempt Backend Order Creation
      const { data } = await api.post('/orders/create', orderData);

      if (!data.success) {
        throw new Error(data.message || "Server responded with failure");
      }

      // 3. Handle Razorpay (Online Payment)
      if (data.razorpay) {
        const options = {
          key: data.razorpay.key,
          amount: data.razorpay.amount,
          currency: "INR",
          name: "TRIIIO",
          description: "Order Payment",
          order_id: data.razorpay.id,
          handler: async function (response: any) {
            try {
              await api.post('/payment/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                dbOrderId: data.razorpay.dbOrderId
              });

              // Success: Redirect to Success Page
              clearCart();
              showToast("Payment successful!", 'success');
              navigate(`/order-success/${data.razorpay.dbOrderId}`);
            } catch (err) {
              showToast("Payment verification failed", 'error');
              // Optional: fallback to WhatsApp here? User didn't request explicitly for verify-fail.
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone || ""
          },
          theme: { color: "#008B9E" }
        };

        if (!window.Razorpay) {
          throw new Error("Razorpay SDK not loaded");
        }
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
        return; // Stop here, Razorpay handles the rest
      }

      // 4. Handle COD/WhatsApp Success Case (No Razorpay data returned)
      // Fall through to WhatsApp redirect below

    } catch (err) {
      console.warn("Backend Order Creation Failed, failing over to WhatsApp:", err);
      // Fall through to WhatsApp redirect
    } finally {
      setLoading(false);
    }

    // 5. FAIL-SAFE / DEFAULT: WhatsApp Redirect
    // This runs if:
    // a) Backend was successful but no Razorpay (COD flow)
    // b) Backend failed (Catch block executed)
    // This ensures we NEVER block the user.

    sendOrderToWhatsApp({
      orderId: frontendOrderId,
      address: {
        name: selected.fullName,
        street: selected.addressLine1 + (selected.addressLine2 ? ', ' + selected.addressLine2 : ''),
        city: selected.city,
        state: selected.state,
        pincode: selected.pincode,
      },
      products: whatsappProducts,
      totalAmount: totalAmountVal,
      phone: customerData.phone,
      orderType: orderData.orderType,
    });

    showToast("Order placed via WhatsApp", 'success');
    clearCart();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Select Delivery Address</h2>

      {addresses.length === 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-4">
          <p className="font-bold">No addresses found.</p>
          <p className="text-sm my-2">Please add an address before checkout.</p>
          <Link to="/addresses" className="bg-red-600 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-widest inline-block hover:bg-red-700">Add Address</Link>
        </div>
      )}

      <div className="space-y-4 mb-8">
        {addresses.map(addr => (
          <label
            key={addr._id}
            className={`border rounded-lg p-4 flex gap-4 cursor-pointer transition hover:bg-gray-50 ${selected?._id === addr._id ? 'border-teal-600 bg-teal-50 ring-1 ring-teal-600' : 'border-gray-200'}`}
          >
            <input
              type="radio"
              name="address"
              className="accent-teal-600 mt-1 w-4 h-4 shrink-0"
              checked={selected?._id === addr._id}
              onChange={() => setSelected(addr)}
            />
            <div>
              <p className="font-bold text-gray-900">{addr.fullName}</p>
              <p className="text-sm text-gray-600">{addr.addressLine1}</p>
              {addr.addressLine2 && <p className="text-sm text-gray-600">{addr.addressLine2}</p>}
              <p className="text-sm text-gray-600">
                {addr.city}, {addr.state} - <span className="font-bold text-gray-800">{addr.pincode}</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">{addr.phone}</p>
            </div>
            {addr.isDefault && <span className="ml-auto text-xs font-bold text-teal-600 px-2 py-1 bg-teal-100 rounded self-start uppercase tracking-wider">Default</span>}
          </label>
        ))}
      </div>

      {addresses.length > 0 && (
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded border border-gray-100 mb-6">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">Total Amount</p>
            <p className="text-2xl font-bold text-teal-600">{formatPrice(cartTotal > 75 ? cartTotal : cartTotal + 10)}</p>
          </div>
          <AnimatedButton
            disabled={!selected || loading}
            className="w-48 h-12 rounded-md disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-widest transition shadow-lg"
            onClick={placeOrder}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </AnimatedButton>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link to="/cart" className="text-gray-500 text-sm hover:underline">Return to Cart</Link>
      </div>
    </div>
  );
};

export default Checkout;
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaCheckCircle, FaArrowRight, FaTruck, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { api } from '../src/api/client';
import { useCurrency } from '../context/CurrencyContext';
import { Order } from '../types';

const MotionDiv = motion.div as any;

const OrderSuccess: React.FC = () => {
    const { orderId } = useParams();
    const { formatPrice } = useCurrency();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch order details
        if (orderId) {
            api.get(`/orders/${orderId}`)
                .then(res => setOrder(res.data))
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [orderId]);

    // Calculate estimated delivery (5 days from now)
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 5);
    const deliveryDateString = estimatedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 py-12">
            <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white max-w-3xl w-full rounded-sm shadow-xl overflow-hidden border-t-8 border-[#008B9E]"
            >
                <div className="p-10 text-center border-b border-gray-100">
                    <div className="flex justify-center mb-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                        >
                            <FaCheckCircle className="text-7xl text-[#008B9E]" />
                        </motion.div>
                    </div>

                    <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900 mb-2">Order Confirmed!</h1>
                    <p className="text-gray-500 mb-2 text-lg">Thank you for your purchase.</p>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Order #{orderId?.slice(-6).toUpperCase()}</p>
                </div>

                {loading ? (
                    <div className="p-10 text-center text-gray-400 uppercase tracking-widest text-xs">Loading order details...</div>
                ) : order ? (
                    <div className="p-8 grid md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2">
                                    <FaTruck /> Estimated Delivery
                                </h3>
                                <p className="font-sans font-bold text-xl text-gray-900">{deliveryDateString}</p>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2">
                                    <FaMapMarkerAlt /> Shipping To
                                </h3>
                                <div className="text-sm text-gray-600">
                                    <p className="font-bold text-gray-900">{order.shippingAddress.addressLine1}</p>
                                    {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                                    <p>{order.shippingAddress.pincode}, {order.shippingAddress.country}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-sm border border-gray-100">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-200 pb-2">Order Summary</h3>
                            <div className="space-y-3 mb-4 max-h-40 overflow-y-auto custom-scrollbar">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start text-sm">
                                        <div>
                                            <span className="font-bold text-gray-800">{item.quantity}x</span> {item.name}
                                            <div className="text-xs text-gray-500">{item.size} / {item.color}</div>
                                            <div className="text-[10px] text-[#008B9E] font-semibold mt-0.5">Expected delivery within 4-5 days</div>
                                        </div>
                                        <span className="font-bold text-gray-600">{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                <span className="font-bold text-gray-900">Total Paid</span>
                                <span className="font-black text-xl text-[#008B9E]">{formatPrice(order.orderAmount)}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-10 text-center text-red-500">Order details could not be retrieved.</div>
                )}

                <div className="bg-gray-100 p-6 flex flex-col md:flex-row gap-4 justify-center">
                    <Link to="/orders" className="flex-1 bg-[#008B9E] text-white py-4 font-bold uppercase tracking-widest hover:bg-[#006D7C] transition text-center shadow-lg">
                        Track Order
                    </Link>
                    <Link to="/" className="flex-1 border border-gray-300 bg-white text-gray-700 py-4 font-bold uppercase tracking-widest hover:bg-gray-50 transition flex items-center justify-center gap-2 text-center">
                        Continue Shopping <FaArrowRight size={12} />
                    </Link>
                </div>
            </MotionDiv>
        </div>
    );
};

export default OrderSuccess;
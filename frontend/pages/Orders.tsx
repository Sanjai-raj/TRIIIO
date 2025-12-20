
import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { api } from '../src/api/client';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { Order } from '../types';
import { PLACEHOLDER_IMG } from '../src/constants';
import { FaChevronDown, FaChevronUp, FaBox, FaMapMarkerAlt, FaCreditCard, FaShoppingBag, FaFileInvoice, FaBan, FaTruck, FaCheck } from 'react-icons/fa';

const Orders: React.FC = () => {
    const { user } = useAuth();
    const { formatPrice } = useCurrency();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
    const [cancelling, setCancelling] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            api.get('/orders/myorders')
                .then(res => setOrders(res.data))
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [user]);

    if (!user) return <Navigate to="/login" />;

    const toggleOrder = (orderId: string) => {
        const newSet = new Set(expandedOrders);
        if (newSet.has(orderId)) {
            newSet.delete(orderId);
        } else {
            newSet.add(orderId);
        }
        setExpandedOrders(newSet);
    };

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleCancelOrder = async (orderId: string) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        setCancelling(orderId);
        try {
            api.put(`/orders/${orderId}/cancel`);
            // Update local state
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: 'Cancelled' } : o));
            alert("Order cancelled successfully.");
        } catch (e: any) {
            alert(e.response?.data?.message || "Failed to cancel order");
        } finally {
            setCancelling(null);
        }
    };

    const downloadInvoice = (order: Order) => {
        // In a real app, this would fetch a PDF blob
        // For demo, we'll trigger a print of a new window or just alert
        alert(`Downloading Invoice for Order #${order._id.slice(-6)}...`);
        window.print();
    };

    const STEPS = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];
    const getStepStatus = (currentStatus: string, step: string) => {
        if (currentStatus === 'Cancelled') return 'cancelled';
        const currentIndex = STEPS.indexOf(currentStatus);
        const stepIndex = STEPS.indexOf(step);
        if (currentIndex >= stepIndex) return 'completed';
        return 'pending';
    };

    if (loading) return <div className="p-20 text-center text-gray-500 uppercase text-xs tracking-widest">Loading your orders...</div>;

    return (
        <div className="max-w-5xl mx-auto px-6 py-12 min-h-screen">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 text-[#008B9E] font-serif">Order History</h1>
            <p className="text-gray-500 text-sm mb-10">View and track your past purchases.</p>

            {orders.length === 0 ? (
                <div className="bg-gray-50 p-16 text-center border border-dashed border-gray-300 rounded-sm">
                    <FaBox className="mx-auto text-gray-300 mb-4" size={40} />
                    <h3 className="text-xl font-bold text-gray-900 mb-2 uppercase tracking-wide">No Orders Found</h3>
                    <p className="text-gray-500 mb-8 font-light text-sm">You haven't placed any orders yet. Check out our latest collection.</p>
                    <Link to="/shop" className="bg-[#008B9E] text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-[#006D7C] transition text-xs">Start Shopping</Link>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map(order => {
                        const isExpanded = expandedOrders.has(order._id);
                        return (
                            <div key={order._id} className="border border-gray-200 bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-md transition duration-300">
                                {/* Compact Header */}
                                <div
                                    className="px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-4 cursor-pointer hover:bg-gray-50 transition"
                                    onClick={() => toggleOrder(order._id)}
                                >
                                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                                        <div>
                                            <div className="uppercase text-[10px] font-bold tracking-widest mb-1 text-gray-400">Order Placed</div>
                                            <div className="text-xs font-bold text-gray-900">{formatDate(order.createdAt)}</div>
                                        </div>
                                        <div>
                                            <div className="uppercase text-[10px] font-bold tracking-widest mb-1 text-gray-400">Total</div>
                                            <div className="text-sm font-bold text-[#008B9E]">{formatPrice(order.orderAmount)}</div>
                                        </div>
                                        <div>
                                            <div className="uppercase text-[10px] font-bold tracking-widest mb-1 text-gray-400">Order #</div>
                                            <div className="text-sm font-mono text-gray-600">{order._id.slice(-8).toUpperCase()}</div>
                                        </div>
                                        <div>
                                            <div className="uppercase text-[10px] font-bold tracking-widest mb-1 text-gray-400">Status</div>
                                            <div>
                                                <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm border ${order.orderStatus === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    order.orderStatus === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                                        'bg-blue-50 text-blue-700 border-blue-200'
                                                    }`}>
                                                    {order.orderStatus}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#008B9E] transition">
                                            {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="border-t border-gray-100 bg-gray-50/30">
                                        {/* Status Tracker */}
                                        {order.orderStatus !== 'Cancelled' ? (
                                            <div className="px-8 py-8 border-b border-gray-100 bg-white">
                                                <h4 className="font-bold text-xs uppercase tracking-widest mb-6 flex items-center gap-2 text-gray-900">
                                                    <FaTruck className="text-[#008B9E]" /> Order Status
                                                </h4>
                                                <div className="flex items-center justify-between relative">
                                                    {/* Line */}
                                                    <div className="absolute left-0 top-3 w-full h-1 bg-gray-100 -z-0"></div>

                                                    {STEPS.map((step, idx) => {
                                                        const status = getStepStatus(order.orderStatus, step);
                                                        const isCompleted = status === 'completed';

                                                        return (
                                                            <div key={step} className="flex flex-col items-center z-10 relative">
                                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 mb-2 ${isCompleted ? 'bg-[#008B9E] border-[#008B9E] text-white' : 'bg-white border-gray-300 text-transparent'}`}>
                                                                    <FaCheck size={10} />
                                                                </div>
                                                                <span className={`text-[10px] font-bold uppercase tracking-wider ${isCompleted ? 'text-[#008B9E]' : 'text-gray-400'}`}>{step}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="px-8 py-4 bg-red-50 border-b border-red-100 text-red-700 text-xs font-bold uppercase tracking-widest text-center">
                                                This order has been cancelled
                                            </div>
                                        )}

                                        {/* Address & Payment Info */}
                                        <div className="grid md:grid-cols-2 gap-8 px-8 py-8 border-b border-gray-100">
                                            <div>
                                                <h4 className="font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2 text-gray-900">
                                                    <FaMapMarkerAlt className="text-[#008B9E]" /> Shipping Details
                                                </h4>
                                                <div className="text-sm text-gray-600 leading-relaxed bg-white p-4 border border-gray-100 shadow-sm rounded-sm">
                                                    <p className="font-bold text-gray-900">{user.name}</p>
                                                    <p>{order.shippingAddress?.addressLine1}</p>
                                                    {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress?.addressLine2}</p>}
                                                    <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</p>
                                                    <p>{order.shippingAddress?.country}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2 text-gray-900">
                                                    <FaCreditCard className="text-[#008B9E]" /> Payment Info
                                                </h4>
                                                <div className="text-sm text-gray-600 bg-white p-4 border border-gray-100 shadow-sm rounded-sm">
                                                    <p className="flex justify-between mb-1">
                                                        <span>Method:</span> <span className="font-bold text-gray-900">{order.paymentMethod || 'Online'}</span>
                                                    </p>
                                                    <p className="flex justify-between mb-1">
                                                        <span>Payment Status:</span>
                                                        <span className={`font-bold ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
                                                            {order.paymentStatus}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Items List */}
                                        <div className="px-8 py-8">
                                            <h4 className="font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2 text-gray-900">
                                                <FaShoppingBag className="text-[#008B9E]" /> Items Ordered
                                            </h4>
                                            <div className="space-y-4">
                                                {order.items.map((item: any, idx) => {
                                                    // Handle both populated product objects and raw ID strings
                                                    const productId = typeof item.product === 'string' ? item.product : item.product?._id;

                                                    return (
                                                        <div key={idx} className="flex gap-4 items-center bg-white p-3 border border-gray-100 shadow-sm rounded-sm">
                                                            <div className="w-16 h-20 bg-gray-100 flex-shrink-0 overflow-hidden rounded-sm border border-gray-200">
                                                                {productId ? (
                                                                    <Link to={`/product/${productId}`}>
                                                                        <img src={item.image || PLACEHOLDER_IMG} alt={item.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition" />
                                                                    </Link>
                                                                ) : (
                                                                    <img src={item.image || PLACEHOLDER_IMG} alt={item.name} className="w-full h-full object-cover grayscale" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1">
                                                                {productId ? (
                                                                    <Link to={`/product/${productId}`} className="font-bold text-sm text-gray-900 hover:text-[#008B9E] transition">
                                                                        {item.name}
                                                                    </Link>
                                                                ) : (
                                                                    <span className="font-bold text-sm text-gray-900">{item.name}</span>
                                                                )}
                                                                <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
                                                                    {item.size} <span className="mx-1">/</span> {item.color} <span className="mx-1">/</span> Qty: {item.quantity}
                                                                </div>
                                                            </div>
                                                            <div className="font-bold text-sm text-[#008B9E]">
                                                                {formatPrice(item.price)}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="mt-8 flex flex-wrap justify-end gap-4 border-t border-gray-100 pt-6">
                                                <button
                                                    onClick={() => downloadInvoice(order)}
                                                    className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-600 hover:border-[#008B9E] hover:text-[#008B9E] text-[10px] font-bold uppercase tracking-widest transition rounded-sm"
                                                >
                                                    <FaFileInvoice /> Download Invoice
                                                </button>

                                                {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Shipped' && order.orderStatus !== 'Delivered' && (
                                                    <button
                                                        onClick={() => handleCancelOrder(order._id)}
                                                        disabled={cancelling === order._id}
                                                        className="flex items-center gap-2 px-6 py-3 border border-red-200 text-red-500 hover:bg-red-50 text-[10px] font-bold uppercase tracking-widest transition rounded-sm"
                                                    >
                                                        <FaBan /> {cancelling === order._id ? 'Cancelling...' : 'Cancel Order'}
                                                    </button>
                                                )}

                                                {order.items.length > 0 && (
                                                    <button
                                                        className="bg-[#008B9E] text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#006D7C] transition disabled:opacity-50 disabled:cursor-not-allowed rounded-sm shadow-sm"
                                                        disabled={!order.items[0].product}
                                                        onClick={() => {
                                                            const firstItem = order.items[0];
                                                            const pid = typeof firstItem.product === 'string' ? firstItem.product : firstItem.product?._id;
                                                            if (pid) window.location.href = `#/product/${pid}`;
                                                        }}
                                                    >
                                                        Buy it again
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Orders;
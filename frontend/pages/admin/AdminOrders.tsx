import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Order } from '../../types';
import { FaEye, FaSearch, FaFilter, FaMoneyBillWave, FaUndo } from 'react-icons/fa';
import { useCurrency } from '../../context/CurrencyContext';

const AdminOrders: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterStatus, setFilterStatus] = useState('');
  const [searchId, setSearchId] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [filterStatus, filterDate]); // Search triggered manually or on debounce (simplified to manual/effect here)

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      if (searchId) params.append('search', searchId);
      if (filterDate) params.append('date', filterDate);

      const res = await api.get(`/orders?${params.toString()}`);
      setOrders(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/orders/${id}`, { orderStatus: status });
      fetchOrders(); // Refresh to see changes
    } catch (e) {
      alert("Error updating order");
    }
  };

  const handleRefund = async (order: any) => {
    if (!window.confirm(`Initiate refund for Order #${order._id.slice(-6)}? This will mark it as Refunded.`)) return;

    try {
      await api.put(`/orders/${order._id}`, { orderStatus: 'Refunded', paymentStatus: 'Refunded' });
      alert("Refund Processed Successfully (Status Updated)");
      fetchOrders();
    } catch (e) {
      alert("Refund failed");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-[#008B9E]">Order Management</h1>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
        <form onSubmit={handleSearch} className="flex-1 w-full md:w-auto flex gap-2">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-3 text-gray-400 text-xs" />
            <input
              type="text"
              placeholder="Search Order ID..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#008B9E]"
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
            />
          </div>
          <button type="submit" className="bg-[#008B9E] text-white px-4 py-2 rounded-sm text-sm font-bold">Search</button>
        </form>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative">
            <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] text-gray-400 font-bold uppercase">Status</span>
            <select
              className="border border-gray-200 rounded-sm py-2 px-4 text-sm focus:outline-none focus:border-[#008B9E] min-w-[140px]"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
          <div className="relative">
            <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] text-gray-400 font-bold uppercase">Date</span>
            <input
              type="date"
              className="border border-gray-200 rounded-sm py-2 px-4 text-sm focus:outline-none focus:border-[#008B9E]"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
            />
          </div>
          <button onClick={() => { setFilterStatus(''); setSearchId(''); setFilterDate(''); fetchOrders(); }} className="text-xs text-gray-500 underline hover:text-[#008B9E]">Reset</button>
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white shadow-sm rounded-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order / User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400">Loading orders...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400">No orders found matching filters.</td></tr>
            ) : orders.map(order => (
              <tr key={order._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="font-mono text-xs text-[#008B9E] font-bold mb-1">#{order._id.slice(-6).toUpperCase()}</div>
                  <div className="text-xs text-gray-900 font-bold">{order.user?.name || 'Unknown User'}</div>
                  <div className="text-[10px] text-gray-400">{order.user?.email}</div>
                  <div className="text-[10px] text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4">
                  {order.items.slice(0, 2).map((item: any, i: number) => (
                    <div key={i} className="text-xs text-gray-600 truncate max-w-[150px]">{item.quantity}x {item.name}</div>
                  ))}
                  {order.items.length > 2 && <div className="text-[10px] text-gray-400 italic">+{order.items.length - 2} more</div>}
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">{formatPrice(order.orderAmount)}</div>
                  <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-gray-500 mt-1">
                    <FaMoneyBillWave size={10} /> {order.paymentMethod}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1 inline-block ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : order.paymentStatus === 'Refunded' ? 'bg-purple-100 text-purple-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {order.paymentStatus}
                  </span>
                  {order.razorpayPaymentId && <div className="text-[9px] font-mono text-gray-400 mt-0.5">ID: {order.razorpayPaymentId.slice(-6)}</div>}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className={`border rounded-sm p-1 text-xs font-bold focus:outline-none focus:border-[#008B9E] ${order.orderStatus === 'Cancelled' ? 'text-red-600 bg-red-50 border-red-200' :
                        order.orderStatus === 'Delivered' ? 'text-green-600 bg-green-50 border-green-200' : 'text-[#008B9E]'
                      }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3 items-center">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-gray-500 hover:text-[#008B9E] font-bold text-xs flex items-center gap-1"
                    >
                      <FaEye /> View
                    </button>

                    {/* Refund Action */}
                    {order.paymentStatus === 'Paid' && (order.orderStatus === 'Cancelled' || order.orderStatus === 'Returned') && (
                      <button
                        onClick={() => handleRefund(order)}
                        className="text-purple-600 hover:text-purple-800 font-bold text-xs flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-sm border border-purple-100"
                      >
                        <FaUndo size={10} /> Refund
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white p-6 rounded-sm shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-[#008B9E]">Order Details #{selectedOrder._id.slice(-6)}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-red-500 font-bold">Close</button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <div>
                <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Customer</h4>
                <p className="font-bold text-gray-900">{selectedOrder.user?.name}</p>
                <p className="text-sm text-gray-600">{selectedOrder.user?.email}</p>
                <p className="text-sm text-gray-600">{selectedOrder.user?.phone || 'No phone'}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Shipping Address</h4>
                <p className="text-sm text-gray-600">{selectedOrder.shippingAddress?.line}</p>
                <p className="text-sm text-gray-600">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                <p className="text-sm text-gray-600">{selectedOrder.shippingAddress?.pincode}, {selectedOrder.shippingAddress?.country}</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Items</h4>
              <div className="border border-gray-200 rounded-sm">
                {selectedOrder.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center p-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-sm overflow-hidden">
                        <img src={item.image} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.size} / {item.color} / Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="font-bold text-sm text-[#008B9E]">{formatPrice(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-sm flex justify-between items-center">
              <span className="font-bold text-gray-600">Total Amount</span>
              <span className="text-xl font-black text-[#008B9E]">{formatPrice(selectedOrder.orderAmount)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
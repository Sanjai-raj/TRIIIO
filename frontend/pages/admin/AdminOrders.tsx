import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../../src/api/client';
import { FaEye, FaSearch, FaFilter, FaMoneyBillWave, FaUndo, FaWhatsapp, FaBoxes, FaClock, FaCheckCircle, FaChartLine, FaFileDownload, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useCurrency } from '../../context/CurrencyContext';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

// Card Component for Analytics
const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-black text-gray-800 mt-1">{value}</p>
    </div>
    <div className={`p-3 rounded-full ${color} bg-opacity-10 text-xl`}>
      <Icon className={color.replace("bg-", "text-")} />
    </div>
  </div>
);

const AdminOrders: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  // Filters
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Socket Connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    // Connect to Socket.IO with Auth Token
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      auth: { token }
    });

    socket.on('connect_error', (err) => {
      console.error("Socket connection error:", err.message);
    });

    socket.on('new-order', (newOrder: any) => {
      // If on page 1, prepend. Else notify.
      if (page === 1) {
        setOrders(prev => [newOrder, ...prev]);
        toast.success("New Order Received!");
      } else {
        toast.success("New Order Received! Check Page 1.");
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [page]);

  // Fetch Orders on Filter/Page Change
  useEffect(() => {
    fetchOrders();
  }, [page, filterStatus, startDate, endDate]); // Trigger fetch on these changes. Search is manual.

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '20'); // 20 per page

      if (filterStatus) params.append('status', filterStatus);
      if (searchQuery) params.append('search', searchQuery);
      if (startDate) params.append('date', startDate);
      // Backend handles "date" as single day search or we can impl range if backend supports it.
      // Current backend impl for 'date' is specific day.

      const res = await api.get(`/orders?${params.toString()}`);

      // Handle response structure depending on backend standard
      if (res.data.orders) {
        setOrders(res.data.orders);
        setTotalPages(res.data.totalPages);
        setTotalOrders(res.data.total);
      } else if (Array.isArray(res.data)) {
        // Fallback if backend returns array (legacy)
        setOrders(res.data);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to page 1 for new search
    fetchOrders();
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/orders/${id}`, { orderStatus: status });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: status } : o));
      toast.success("Order status updated");
    } catch (e) {
      toast.error("Error updating order");
    }
  };

  const handleRefund = async (order: any) => {
    if (!window.confirm(`Initiate refund for Order #${order._id.slice(-6)}? This will mark it as Refunded.`)) return;

    try {
      await api.put(`/orders/${order._id}`, { orderStatus: 'Refunded', paymentStatus: 'Refunded' });
      toast.success("Refund Processed Successfully");
      setOrders(prev => prev.map(o => o._id === order._id ? { ...o, orderStatus: 'Refunded', paymentStatus: 'Refunded' } : o));
    } catch (e) {
      toast.error("Refund failed");
    }
  };

  const openWhatsApp = (order: any) => {
    const phone = order.customer?.phone || order.user?.phone;
    if (!phone) {
      toast.error("No phone number available");
      return;
    }
    const formattedPhone = phone.length === 10 ? `91${phone}` : phone;
    const msg = `Hello ${order.user?.name || 'Customer'},\nRegarding Order ID: ${order.orderId || order._id.slice(-6).toUpperCase()}\nTotal Amount: ${formatPrice(order.orderAmount)}\nStatus: ${order.orderStatus}\n\nThank you for shopping with TRIIIO!`;
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const exportCSV = async () => {
    try {
      // Use direct window open for file download, or API blob fetch
      // Using standard window.open with auth token is tricky if API requires header.
      // Since our endpoint expects 'adminAuth' middleware looking for Header, a simple link won't work easily unless we use cookies or query param auth.
      // BUT, we configured `res.attachment` in backend.
      // Best way: Axios blob download.
      const res = await api.get('/orders/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      console.error(e);
      toast.error("Export failed");
    }
  };

  // Analytics - For server-side pagination, these numbers should ideally come from a specific /stats endpoint 
  // or the `total` from response, but simple breakdown (Pending/Delivered) across ALL pages isn't available in standard paginated response.
  // We'll rely on the `totalOrders` for now, or fetch a stats summary separately if needed.
  // For now, retaining the UI but note that counts might only reflect current page OR we need a separate stats call.
  // Let's implement a separate lightweight stats fetch or just use Total.
  // To keep it robust, let's assume we want accurate global stats.
  // I'll add a quick duplicate fetch effect for stats or just show "Total". 
  // For simplicity matching the plan, I'll show Total from pagination data and maybe hide the others or populate them if I add a stats endpoint.
  // Actually, there IS an `/admin/stats` endpoint in `server.ts`! I should use that!

  const [stats, setStats] = useState({ totalOrders: 0, pending: 0, delivered: 0, revenue: 0 });
  useEffect(() => {
    api.get('/admin/stats').then(res => {
      // Map backend stats to our UI
      // Bakend returns: { totalOrders, lowStockCount, userCount, totalRevenue, recentOrders }
      // We need Pending/Delivered counts. Backend doesn't send them yet.
      // I will use what I have.
      setStats({
        totalOrders: res.data.totalOrders,
        pending: 0, // Not available yet
        delivered: 0, // Not available yet
        revenue: res.data.totalRevenue
      });
    }).catch(err => console.error(err));
  }, [orders]); // Refresh stats when orders change

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#008B9E]">Order Management</h1>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Live
          </div>
          <button onClick={exportCSV} className="flex items-center gap-2 text-xs font-bold bg-white border border-gray-200 px-3 py-1.5 rounded-sm hover:bg-gray-50 transition">
            <FaFileDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* ANALYTICS CARDS (Powered by /admin/stats) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Orders" value={stats.totalOrders} icon={FaBoxes} color="text-blue-600 bg-blue-600" />
        <StatCard title="Revenue" value={formatPrice(stats.revenue)} icon={FaChartLine} color="text-[#008B9E] bg-[#008B9E]" />
        {/* Placeholder for others / specific fetch needed */}
        <StatCard title="Pending (Page)" value={orders.filter(o => o.orderStatus === 'Pending').length} icon={FaClock} color="text-yellow-600 bg-yellow-600" />
        <StatCard title="On Page" value={orders.length} icon={FaCheckCircle} color="text-green-600 bg-green-600" />
      </div>

      {/* FILTER BAR (+ Pagination Controls Top) */}
      <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-200 mb-6 flex flex-col lg:flex-row gap-4 items-end lg:items-center justify-between">

        <form onSubmit={handleSearch} className="relative w-full lg:w-96">
          <FaSearch className="absolute left-3 top-3 text-gray-400 text-xs" />
          <input
            type="text"
            placeholder="Search Order ID or Phone..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#008B9E]"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="flex flex-wrap gap-4 w-full lg:w-auto items-center">
          <select
            className="border border-gray-200 rounded-sm py-2 px-4 text-sm focus:outline-none focus:border-[#008B9E]"
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

          <div className="flex items-center gap-2">
            <input type="date" className="border border-gray-200 rounded-sm py-2 px-2 text-sm focus:outline-none focus:border-[#008B9E]" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>

          <button onClick={() => { setFilterStatus(''); setSearchQuery(''); setStartDate(''); setEndDate(''); setPage(1); }} className="text-xs text-gray-500 underline hover:text-[#008B9E] whitespace-nowrap">
            Reset
          </button>
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white shadow-sm rounded-sm border border-gray-200 overflow-x-auto min-h-[400px]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
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
                  <div className="font-mono text-xs text-[#008B9E] font-bold mb-1">{order.orderId ? `#${order.orderId}` : `#${order._id.slice(-6).toUpperCase()}`}</div>
                  <div className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</div>
                  <div className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleTimeString()}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-gray-900">{order.user?.name || order.customer?.name || 'Guest'}</div>
                  <div className="text-xs text-gray-500">{order.user?.phone || order.customer?.phone || 'No Phone'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">{formatPrice(order.orderAmount || order.totalAmount)}</div>
                  <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-gray-500 mt-1">
                    <FaMoneyBillWave size={10} /> {order.paymentMethod}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1 inline-block ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : order.paymentStatus === 'Refunded' ? 'bg-purple-100 text-purple-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className={`border rounded-sm p-1 text-xs font-bold focus:outline-none focus:border-[#008B9E] ${order.orderStatus === 'Cancelled' ? 'text-red-600 bg-red-50 border-red-200' : order.orderStatus === 'Delivered' ? 'text-green-600 bg-green-50 border-green-200' : 'text-[#008B9E]'}`}
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
                    <button onClick={() => setSelectedOrder(order)} className="text-gray-500 hover:text-[#008B9E] font-bold text-xs flex items-center gap-1" title="View Details">
                      <FaEye /> View
                    </button>
                    <button onClick={() => openWhatsApp(order)} className="text-green-600 hover:text-green-800 font-bold text-xs flex items-center gap-1 bg-green-50 px-2 py-1 rounded-sm border border-green-100" title="Open WhatsApp">
                      <FaWhatsapp size={14} /> Chat
                    </button>
                    {order.paymentStatus === 'Paid' && (order.orderStatus === 'Cancelled' || order.orderStatus === 'Returned') && (
                      <button onClick={() => handleRefund(order)} className="text-purple-600 hover:text-purple-800 font-bold text-xs flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-sm border border-purple-100">
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

      {/* PAGINATION CONTROLS */}
      <div className="flex justify-between items-center mt-4 bg-white p-4 rounded-sm shadow-sm border border-gray-200">
        <div className="text-xs text-gray-500">
          Showing Page <span className="font-bold text-gray-800">{page}</span> of <span className="font-bold text-gray-800">{totalPages}</span> ({totalOrders} Orders)
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 border rounded-sm disabled:opacity-50 hover:bg-gray-50"
          >
            <FaChevronLeft /> Prev
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 border rounded-sm disabled:opacity-50 hover:bg-gray-50"
          >
            Next <FaChevronRight />
          </button>
        </div>
      </div>

      {/* ORDER DETAILS MODAL (UNCHANGED logic, just re-rendering) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white p-6 rounded-sm shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-[#008B9E]">Order Details {selectedOrder.orderId ? `#${selectedOrder.orderId}` : `#${selectedOrder._id.slice(-6).toUpperCase()}`}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-red-500 font-bold">Close</button>
            </div>
            {/* Same modal content as before */}
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <div>
                <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Customer</h4>
                <p className="font-bold text-gray-900">{selectedOrder.user?.name || selectedOrder.customer?.name}</p>
                <p className="text-sm text-gray-600">{selectedOrder.user?.email}</p>
                <p className="text-sm text-gray-600">{selectedOrder.user?.phone || selectedOrder.customer?.phone || 'No phone'}</p>
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
              <span className="text-xl font-black text-[#008B9E]">{formatPrice(selectedOrder.orderAmount || selectedOrder.totalAmount)}</span>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={() => openWhatsApp(selectedOrder)} className="text-white font-bold text-sm flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-sm shadow-sm transition">
                <FaWhatsapp size={16} /> Open in WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
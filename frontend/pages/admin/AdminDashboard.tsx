import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import io from 'socket.io-client';
import { PLACEHOLDER_IMG } from '../../src/constants';
import { FaBoxOpen, FaDollarSign, FaExclamationTriangle, FaUsers } from 'react-icons/fa';
import { useCurrency } from '../../context/CurrencyContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [stats, setStats] = useState<any>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    // Fetch initial stats
    api.get('/admin/stats').then(res => setStats(res.data)).catch(console.error);

    // Mock Sales Data for Graph (Adjusted to assumed USD values for demo consistency if needed, assuming these are raw numbers)
    // If we want "entire... including conversions", we should display these as converted.
    // The chart will take these values.
    const mockSales = [
      { name: 'Mon', sales: 4000, orders: 24 },
      { name: 'Tue', sales: 3000, orders: 13 },
      { name: 'Wed', sales: 2000, orders: 18 },
      { name: 'Thu', sales: 2780, orders: 39 },
      { name: 'Fri', sales: 1890, orders: 48 },
      { name: 'Sat', sales: 2390, orders: 38 },
      { name: 'Sun', sales: 3490, orders: 43 },
    ];
    setSalesData(mockSales);

    // Mock Top Products
    setTopProducts([
      { name: 'Classic Oxford', sales: 120 },
      { name: 'Navy Linen', sales: 98 },
      { name: 'Blackout Party', sales: 86 },
      { name: 'Beige Breeze', sales: 54 },
    ]);

    // Socket.io for Real-time
    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
    });
    socket.on('new-order', (data) => {
      setNotifications(prev => [`New Order: ${data.orderId} received!`, ...prev]);
      api.get('/admin/stats').then(res => setStats(res.data));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (!stats) return <div className="p-10 text-center text-[#008B9E] animate-pulse">Loading Analytics...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#008B9E]">Overview</h1>
        <div className="text-sm text-gray-400">Last updated: {new Date().toLocaleTimeString()}</div>
      </div>

      {notifications.length > 0 && (
        <div className="bg-teal-50 border-l-4 border-[#008B9E] text-teal-900 p-4 rounded-sm shadow-sm" role="alert">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold">Notifications</p>
              {notifications.map((msg, i) => <p key={i} className="text-sm">{msg}</p>)}
            </div>
            <button onClick={() => setNotifications([])} className="text-xs font-bold text-[#008B9E] hover:underline">Clear</button>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Orders', value: stats.totalOrders, icon: <FaBoxOpen />, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: <FaDollarSign />, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'Customers', value: stats.userCount, icon: <FaUsers />, color: 'text-purple-500', bg: 'bg-purple-50' },
          { label: 'Low Stock Alerts', value: stats.lowStockCount, icon: <FaExclamationTriangle />, color: 'text-orange-500', bg: 'bg-orange-50' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition duration-300">
            <div className={`p-4 rounded-full ${item.bg} ${item.color} text-xl`}>{item.icon}</div>
            <div>
              <div className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-1">{item.label}</div>
              <div className="text-2xl font-black text-gray-800">{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-sm shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-6 uppercase tracking-wide text-xs">Revenue Trend (Last 7 Days)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#008B9E" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#008B9E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  tickFormatter={(value) => formatPrice(value)}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value: number) => [formatPrice(value), "Sales"]}
                />
                <Area type="monotone" dataKey="sales" stroke="#008B9E" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products Chart */}
        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-6 uppercase tracking-wide text-xs">Top Selling Products</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10, fill: '#4B5563', fontWeight: 'bold' }} />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  formatter={(value: number) => [formatPrice(value), "Sales"]}
                />
                <Bar dataKey="sales" fill="#008B9E" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-bold mb-6 uppercase tracking-wide text-gray-500">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100 text-xs uppercase tracking-wider">
                <th className="py-3 font-medium">Order ID</th>
                <th className="font-medium">Status</th>
                <th className="font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders?.map((o: any) => (
                <tr key={o._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">
                  <td className="py-4 text-sm font-bold font-mono text-gray-600">#{o._id.slice(-6)}</td>
                  <td><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${o.orderStatus === 'Confirmed' ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>{o.orderStatus}</span></td>
                  <td><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${o.orderStatus === 'Confirmed' ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>{o.orderStatus}</span></td>
                  <td className="font-bold text-[#008B9E] text-right">{formatPrice(o.orderAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
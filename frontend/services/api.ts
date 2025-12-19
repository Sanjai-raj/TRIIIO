import axios from 'axios';
import { API_URL, PLACEHOLDER_IMG } from '../constants';
import { Product, User } from '../types';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// No token interceptor needed for HttpOnly cookies
/*
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));
*/

// --- MOCK DATA FOR DEMO MODE ---
const MOCK_USER: User = { _id: '1', name: 'Demo User', email: 'user@example.com', role: 'user', isActive: true };
const MOCK_OWNER: User = { _id: '2', name: 'Demo Owner', email: 'owner@example.com', role: 'owner', isActive: true };

// Updated Mock Products - SHIRTS COLLECTION with Variants
const MOCK_PRODUCTS: Product[] = [
  {
    _id: '201',
    name: 'The Classic Oxford',
    price: 59,
    description: 'A timeless white oxford shirt made from premium Egyptian cotton. Perfect for office or casual wear.',
    category: 'Formal',
    brand: 'TRIIIO Premium',
    tags: ['cotton', 'office', 'white'],
    sizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { size: 'S', stock: 5 },
      { size: 'M', stock: 10 },
      { size: 'L', stock: 3 },
      { size: 'XL', stock: 2 }
    ],
    colors: ['White'],
    stock: 20,
    status: 'active',
    images: [{ url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80', publicId: '201' }],
    reviews: [
      { _id: 'r1', user: 'James D.', rating: 5, comment: 'Perfect fit and quality.', date: new Date().toISOString() },
      { _id: 'r2', user: 'Alex S.', rating: 4, comment: 'Slightly loose on the sleeves but great fabric.', date: new Date().toISOString() }
    ],
    rating: 4.5,
    createdAt: new Date().toISOString()
  },
  {
    _id: '202',
    name: 'Midnight Navy Linen',
    price: 65,
    description: 'Breathable, lightweight linen shirt designed for summer evenings. Features a relaxed fit.',
    category: 'Linen',
    brand: 'Summer Vibes',
    tags: ['linen', 'summer', 'navy'],
    sizes: ['M', 'L', 'XL'],
    variants: [
      { size: 'M', stock: 5 },
      { size: 'L', stock: 5 },
      { size: 'XL', stock: 5 }
    ],
    colors: ['Navy'],
    stock: 15,
    status: 'active',
    images: [{ url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', publicId: '202' }],
    reviews: [],
    rating: 0,
    createdAt: new Date().toISOString()
  },
  {
    _id: '203',
    name: 'Urban Denim Wash',
    price: 75,
    description: 'Rugged yet refined denim shirt with snap buttons and a vintage wash finish.',
    category: 'Denim',
    sizes: ['S', 'M', 'L', 'XXL'],
    variants: [
      { size: 'S', stock: 0 }, // Out of stock size example
      { size: 'M', stock: 2 },
      { size: 'L', stock: 1 },
      { size: 'XXL', stock: 0 }
    ],
    colors: ['Blue'],
    stock: 3,
    status: 'active',
    images: [{ url: 'https://images.unsplash.com/photo-1589465885857-44edb59ef526?auto=format&fit=crop&w=800&q=80', publicId: '203' }],
    reviews: [
      { _id: 'r3', user: 'Mike T.', rating: 5, comment: 'Love the snaps!', date: new Date().toISOString() }
    ],
    rating: 5,
    createdAt: new Date().toISOString()
  },
  {
    _id: '204',
    name: 'Buffalo Check Flannel',
    price: 49,
    description: 'Warm, soft, and durable. This flannel shirt is a winter essential.',
    category: 'Flannel',
    sizes: ['M', 'L', 'XL'],
    variants: [
      { size: 'M', stock: 10 },
      { size: 'L', stock: 10 },
      { size: 'XL', stock: 5 }
    ],
    colors: ['Red', 'Black'],
    stock: 25,
    status: 'active',
    images: [{ url: 'https://images.unsplash.com/photo-1553859943-a02c5418b798?auto=format&fit=crop&w=800&q=80', publicId: '204' }],
    rating: 0,
    reviews: [],
    createdAt: new Date().toISOString()
  },
  {
    _id: '205',
    name: 'Executive Stripe',
    price: 89,
    description: 'Sharp vertical stripes for a slimming, professional look. Non-iron fabric.',
    category: 'Formal',
    sizes: ['S', 'M', 'L'],
    variants: [
      { size: 'S', stock: 4 },
      { size: 'M', stock: 4 },
      { size: 'L', stock: 4 }
    ],
    colors: ['Blue', 'White'],
    stock: 12,
    status: 'active',
    images: [{ url: 'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?auto=format&fit=crop&w=800&q=80', publicId: '205' }],
    rating: 0,
    reviews: [],
    createdAt: new Date().toISOString()
  },
  {
    _id: '206',
    name: 'Beige Breeze',
    price: 55,
    description: 'A neutral beige shirt that pairs with everything. Made from an organic cotton-linen blend.',
    category: 'Linen',
    sizes: ['M', 'L', 'XL', 'XXL'],
    variants: [
      { size: 'M', stock: 5 },
      { size: 'L', stock: 5 },
      { size: 'XL', stock: 4 },
      { size: 'XXL', stock: 4 }
    ],
    colors: ['Beige'],
    stock: 18,
    status: 'active',
    images: [{ url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80', publicId: '206' }],
    rating: 0,
    reviews: [],
    createdAt: new Date().toISOString()
  },
  {
    _id: '207',
    name: 'The Blackout',
    price: 60,
    description: 'Jet black button-down for evening events or sleek office attire.',
    category: 'Party',
    sizes: ['S', 'M', 'L'],
    variants: [
      { size: 'S', stock: 10 },
      { size: 'M', stock: 10 },
      { size: 'L', stock: 10 }
    ],
    colors: ['Black'],
    stock: 30,
    status: 'active',
    images: [{ url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80', publicId: '207' }],
    rating: 0,
    reviews: [],
    createdAt: new Date().toISOString()
  },
  {
    _id: '208',
    name: 'Olive Drab Utility',
    price: 68,
    description: 'Military-inspired design with double chest pockets and durable stitching.',
    category: 'Casual',
    sizes: ['L', 'XL'],
    variants: [
      { size: 'L', stock: 1 },
      { size: 'XL', stock: 1 }
    ],
    colors: ['Olive'],
    stock: 2,
    status: 'active',
    images: [{ url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80', publicId: '208' }],
    rating: 0,
    reviews: [],
    createdAt: new Date().toISOString()
  },
  {
    _id: '209',
    name: 'Mandarin Collar Crisp',
    price: 62,
    description: 'Modern mandarin collar shirt in crisp white. Minimalist and sophisticated.',
    category: 'Casual',
    sizes: ['S', 'M'],
    variants: [
      { size: 'S', stock: 5 },
      { size: 'M', stock: 5 }
    ],
    colors: ['White'],
    stock: 10,
    status: 'active',
    images: [{ url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', publicId: '209' }],
    rating: 0,
    reviews: [],
    createdAt: new Date().toISOString()
  },
  {
    _id: '210',
    name: 'Chambray Workshirt',
    price: 70,
    description: 'Classic chambray texture, lighter than denim but just as stylish.',
    category: 'Casual',
    sizes: ['M', 'L', 'XL'],
    variants: [
      { size: 'M', stock: 5 },
      { size: 'L', stock: 5 },
      { size: 'XL', stock: 4 }
    ],
    colors: ['Blue'],
    stock: 14,
    status: 'active',
    images: [{ url: 'https://images.unsplash.com/photo-1589465885857-44edb59ef526?auto=format&fit=crop&w=800&q=80', publicId: '210' }],
    rating: 0,
    reviews: [],
    createdAt: new Date().toISOString()
  },
  {
    _id: '211',
    name: 'Satin Silk Luxury',
    price: 120,
    description: 'High-end satin finish shirt for formal galas and weddings.',
    category: 'Party',
    sizes: ['M', 'L'],
    variants: [
      { size: 'M', stock: 2 },
      { size: 'L', stock: 2 }
    ],
    colors: ['Black', 'Navy'],
    stock: 4,
    status: 'active',
    images: [{ url: 'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?auto=format&fit=crop&w=800&q=80', publicId: '211' }],
    rating: 0,
    reviews: [],
    createdAt: new Date().toISOString()
  },
  {
    _id: '212',
    name: 'Grey Scale Flannel',
    price: 52,
    description: 'Monochrome checkered flannel. Subtle, warm, and versatile.',
    category: 'Flannel',
    sizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { size: 'S', stock: 5 },
      { size: 'M', stock: 5 },
      { size: 'L', stock: 6 },
      { size: 'XL', stock: 6 }
    ],
    colors: ['Grey'],
    stock: 22,
    status: 'active',
    images: [{ url: 'https://images.unsplash.com/photo-1553859943-a02c5418b798?auto=format&fit=crop&w=800&q=80', publicId: '212' }],
    rating: 0,
    reviews: [],
    createdAt: new Date().toISOString()
  },
  {
    _id: '213',
    name: 'Summer Resort Print',
    price: 45,
    description: 'Bold printed shirt for vacation vibes.',
    category: 'Casual',
    sizes: ['M', 'L'],
    variants: [
      { size: 'M', stock: 4 },
      { size: 'L', stock: 5 }
    ],
    colors: ['Blue'],
    stock: 9,
    status: 'active',
    images: [{ url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', publicId: '213' }],
    rating: 0,
    reviews: [],
    createdAt: new Date().toISOString()
  }
];

// Interceptor to handle Network Errors (Backend Unreachable)
api.interceptors.response.use(
  response => response,
  async error => {
    // Check for Network Error or common connection refused codes
    if (!error.response || error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.warn("Backend unreachable. Switching to Demo/Mock Data mode.");

      const { url, method, data, params } = error.config;

      // Artificial delay for realism
      await new Promise(r => setTimeout(r, 500));

      // --- AUTH MOCKS ---
      if (url.includes('/auth/login')) {
        const body = JSON.parse(data);
        if (body.email.includes('owner')) {
          return { data: { user: MOCK_OWNER, token: 'mock_owner_token' } };
        }
        return { data: { user: MOCK_USER, token: 'mock_user_token' } };
      }
      if (url.includes('/auth/signup')) {
        return { data: { user: MOCK_USER, token: 'mock_user_token' } };
      }
      if (url.includes('/auth/me')) {
        const token = localStorage.getItem('token');
        if (token === 'mock_owner_token') return { data: MOCK_OWNER };
        if (token === 'mock_user_token') return { data: MOCK_USER };
        // If no token or invalid, let it fail so auth context knows to logout
        return Promise.reject({ response: { status: 401 } });
      }

      // --- PRODUCT MOCKS ---
      if (url.includes('/products')) {
        if (method === 'get') {
          if (url.includes('/products/')) {
            // Get Single
            const urlParts = url.split('/');
            const id = urlParts[urlParts.length - 1].split('?')[0];

            if (url.includes('/reviews')) {
              // Ignore reviews get in mock? usually reviews come with product
            }

            const p = MOCK_PRODUCTS.find(p => p._id === id);
            return { data: p || MOCK_PRODUCTS[0] };
          }
          // Get List with Filters
          let filtered = [...MOCK_PRODUCTS];

          if (params) {
            if (params.category) filtered = filtered.filter(p => p.category === params.category);
            if (params.size) filtered = filtered.filter(p => p.sizes.includes(params.size));
            if (params.color) filtered = filtered.filter(p => p.colors.includes(params.color));
            if (params.search) filtered = filtered.filter(p => p.name.toLowerCase().includes(params.search.toLowerCase()));
            if (params.minPrice) filtered = filtered.filter(p => p.price >= Number(params.minPrice));
            if (params.maxPrice) filtered = filtered.filter(p => p.price <= Number(params.maxPrice));

            if (params.sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
            if (params.sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);
          }

          return { data: { products: filtered } };
        }
        // Create/Edit/Delete (Owner)
        if (method === 'post') {
          if (url.includes('/reviews')) {
            // Mock adding review
            const body = JSON.parse(data);
            return { data: { ...MOCK_PRODUCTS[0], reviews: [...(MOCK_PRODUCTS[0].reviews || []), { user: 'Demo User', rating: body.rating, comment: body.comment, date: new Date().toISOString() }] } };
          }
          return { data: MOCK_PRODUCTS[0] };
        }
        if (method === 'put') return { data: MOCK_PRODUCTS[0] };
        if (method === 'delete') return { data: { success: true } };
      }

      // --- ORDER & PAYMENT MOCKS ---
      if (url.includes('/orders/create')) {
        return {
          data: {
            id: 'mock_rzp_order_id',
            amount: 1000,
            key: 'mock_key',
            dbOrderId: 'mock_db_order_123'
          }
        };
      }
      if (url.includes('/payment/verify')) {
        return { data: { status: 'success' } };
      }
      // Cancel Order
      if (url.includes('/orders/') && url.includes('/cancel') && method === 'put') {
        const urlParts = url.split('/');
        const id = urlParts[urlParts.indexOf('orders') + 1];
        return { data: { _id: id, orderStatus: 'Cancelled' } };
      }
      if (url.includes('/orders/myorders')) {
        return {
          data: [
            {
              _id: 'ord_mock_555',
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              orderAmount: 124,
              paymentStatus: 'Paid',
              orderStatus: 'Shipped',
              shippingAddress: { line: '123 Mock St', city: 'Demo City', state: 'DS', pincode: '123456', country: 'India' },
              items: [
                { name: 'The Classic Oxford', price: 59, quantity: 1, size: 'M', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80', product: '201' },
                { name: 'Midnight Navy Linen', price: 65, quantity: 1, size: 'L', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', product: '202' }
              ]
            },
            {
              _id: 'ord_mock_556',
              createdAt: new Date().toISOString(),
              orderAmount: 60,
              paymentStatus: 'Paid',
              orderStatus: 'Confirmed',
              shippingAddress: { line: '123 Mock St', city: 'Demo City', state: 'DS', pincode: '123456', country: 'India' },
              items: [
                { name: 'The Blackout', price: 60, quantity: 1, size: 'L', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80', product: '207' }
              ]
            }
          ]
        };
      }

      // Handle specific order fetch (GET /api/orders/:id) for user
      if (url.match(/\/orders\/[a-zA-Z0-9_]+$/) && !url.includes('myorders') && method === 'get') {
        const urlParts = url.split('/');
        const id = urlParts[urlParts.length - 1];
        // Return a mock order object matching the requested ID
        return {
          data: {
            _id: id,
            createdAt: new Date().toISOString(),
            orderAmount: 119,
            paymentStatus: 'Paid',
            paymentMethod: 'Online',
            orderStatus: 'Confirmed',
            shippingAddress: { line: '123 Success Ln', city: 'Triumph City', state: 'TC', pincode: '999999', country: 'Wonderland' },
            items: [
              { name: 'The Classic Oxford', price: 59, quantity: 1, size: 'M', color: 'White', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80', product: '201' },
              { name: 'The Blackout', price: 60, quantity: 1, size: 'L', color: 'Black', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80', product: '207' }
            ]
          }
        };
      }

      if (url.includes('/orders') && method === 'get') {
        return {
          data: [
            {
              _id: 'ord_12345',
              user: { name: 'Demo User', email: 'user@example.com' },
              items: [{ name: 'The Classic Oxford', quantity: 2, size: 'M', image: PLACEHOLDER_IMG, price: 59 }],
              orderAmount: 118,
              paymentStatus: 'Paid',
              paymentMethod: 'Online',
              orderStatus: 'Confirmed',
              shippingAddress: { line: '42 Wallaby Way', city: 'Sydney', state: 'NSW', pincode: '2000', country: 'Australia' },
              createdAt: new Date().toISOString()
            },
            {
              _id: 'ord_67890',
              user: { name: 'John Doe', email: 'john@example.com' },
              items: [{ name: 'Midnight Navy Linen', quantity: 1, size: 'L', image: PLACEHOLDER_IMG, price: 65 }],
              orderAmount: 65,
              paymentStatus: 'Pending',
              paymentMethod: 'COD',
              orderStatus: 'Pending',
              shippingAddress: { line: '123 Main St', city: 'New York', state: 'NY', pincode: '10001', country: 'USA' },
              createdAt: new Date(Date.now() - 86400000).toISOString()
            }
          ]
        };
      }

      // --- ADMIN USERS MOCK ---
      if (url.includes('/admin/users')) {
        if (method === 'put') {
          // Block/Unblock toggle mock
          return { data: { success: true } };
        }
        return {
          data: [
            { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', isActive: true, orderCount: 5, createdAt: new Date(2023, 1, 15).toISOString() },
            { _id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', isActive: true, orderCount: 12, createdAt: new Date(2023, 3, 20).toISOString() },
            { _id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'user', isActive: false, orderCount: 0, createdAt: new Date(2023, 5, 10).toISOString() },
          ]
        };
      }

      // --- ADMIN STATS ---
      if (url.includes('/admin/stats')) {
        return { data: { totalOrders: 24, totalRevenue: 3450, userCount: 12, lowStockCount: 4, recentOrders: [] } };
      }
    }

    return Promise.reject(error);
  }
);

// Generic Error Handler
export const handleApiError = (error: any) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  if (error.message === 'Network Error') {
    return "Network Error. Using Offline/Demo Mode.";
  }
  return "An unexpected error occurred.";
};

export default api;
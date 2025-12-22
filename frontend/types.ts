export interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'owner';
  phone?: string;
  defaultAddress?: Address;
  isActive?: boolean; // For block/unblock functionality
  createdAt?: string;
  orderCount?: number; // For admin display
  addresses?: Address[];
}

export interface Review {
  _id: string;
  user: string; // User name
  userId?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ProductVariant {
  size: string;
  stock: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  brand?: string;
  tags?: string[];
  sizes: string[]; // Derived from variants for easy filtering
  variants?: ProductVariant[]; // Stock per size
  colors: string[];
  price: number;
  discount?: number;
  stock: number; // Total stock count
  sku?: string;
  status: 'active' | 'inactive';
  images: { url: string; publicId: string }[];
  colorVariants?: { color: string; images: string[] }[];
  reviews?: Review[];
  rating?: number; // Calculated average
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Order {
  _id: string;
  user: User | string;
  items?: {
    product: Product | string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
    image?: string;
  }[];
  products?: {
    name: string;
    productId?: string;
    image?: string;
    size?: string;
    color?: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: Address;
  orderAmount: number;
  paymentMethod?: 'Online' | 'COD';
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  orderStatus: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded' | 'Returned';
  createdAt: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
}

export interface AuthResponse {
  token?: string; // Optional because we use HttpOnly cookies now
  user: User;
}
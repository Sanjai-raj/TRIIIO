// In a real app, this points to your Node server
const HOST = window.location.hostname;
export const API_URL = `http://${HOST}:5001/api`;
export const SOCKET_URL = `http://${HOST}:5001`;

export const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
export const COLORS = ['White', 'Black', 'Navy', 'Grey', 'Olive', 'Maroon', 'Blue', 'Beige'];
// Updated categories for Shirts
export const CATEGORIES = ['Formal', 'Casual', 'Linen', 'Flannel', 'Denim', 'Party'];

// Generic Shirt Placeholder
export const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=500&q=80";
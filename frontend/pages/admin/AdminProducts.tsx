import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Product } from '../../types';
import { Link } from 'react-router-dom';
import { PLACEHOLDER_IMG } from '../../constants';
import { useCurrency } from '../../context/CurrencyContext';
import { getImageUrl } from '../../utils/imageUtils';



const AdminProducts: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    api.get('/products?status=all').then(res => setProducts(res.data.products || res.data));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      await api.delete(`/products/${id}`);
      fetchProducts();
    }
  };

  const getTotalStock = (product: Product) => {
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      return product.variants.reduce((total, v) => total + (v.stock || 0), 0);
    }
    return product.stock || 0;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#008B9E]">Products</h1>
        <Link to="/admin/products/new" className="bg-[#008B9E] text-white px-4 py-2 rounded-sm shadow hover:bg-[#006D7C] text-sm font-bold uppercase tracking-wide">
          Add New Product
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(p => (
              <tr key={p._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {(() => {
                        const imgUrl = getImageUrl(p);
                        return (
                          <img
                            src={imgUrl}
                            alt={p.name}
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }}
                          />
                        );
                      })()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-bold text-gray-900">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#008B9E] font-bold">
                  {formatPrice(p.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getTotalStock(p)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link to={`/admin/products/edit/${p._id}`} className="text-[#008B9E] hover:text-[#006D7C] mr-4 font-bold">Edit</Link>
                  <button onClick={() => handleDelete(p._id)} className="text-gray-400 hover:text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
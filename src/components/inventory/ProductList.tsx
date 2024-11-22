import React from 'react';
import { Edit2, Trash2, AlertTriangle, Package as PackageIcon } from 'lucide-react';
import { useProductStore } from '../../store/productStore';
import type { Database } from '../../types/database';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductListProps {
  searchQuery: string;
  onEdit: (product: Product) => void;
}

export default function ProductList({ searchQuery, onEdit }: ProductListProps) {
  const { products, loading, error, deleteProduct } = useProductStore();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStockStatus = (stock: number): 'in-stock' | 'low-stock' | 'out-of-stock' => {
    if (stock === 0) return 'out-of-stock';
    if (stock <= 5) return 'low-stock';
    return 'in-stock';
  };

  const statusStyles = {
    'in-stock': 'bg-green-900/30 text-green-300',
    'low-stock': 'bg-yellow-900/30 text-yellow-300',
    'out-of-stock': 'bg-red-900/30 text-red-300',
  };

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-gray-800 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card rounded-xl border border-gray-800 p-8">
        <div className="flex items-center justify-center text-error gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span>Failed to load products. Please try again.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-gray-800">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left p-4 text-text-secondary font-medium">Product</th>
              <th className="text-left p-4 text-text-secondary font-medium">Brand</th>
              <th className="text-left p-4 text-text-secondary font-medium">Type</th>
              <th className="text-left p-4 text-text-secondary font-medium">SKU</th>
              <th className="text-left p-4 text-text-secondary font-medium">Size</th>
              <th className="text-left p-4 text-text-secondary font-medium">Price</th>
              <th className="text-left p-4 text-text-secondary font-medium">Stock</th>
              <th className="text-left p-4 text-text-secondary font-medium">Category</th>
              <th className="text-left p-4 text-text-secondary font-medium">Status</th>
              <th className="text-right p-4 text-text-secondary font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredProducts.map((product) => {
              const status = getStockStatus(product.stock);
              return (
                <tr key={product.id} className="hover:bg-surface/50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                          <PackageIcon className="w-5 h-5 text-text-secondary" />
                        </div>
                      )}
                      <span className="font-medium text-white">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-text-secondary">{product.brand}</td>
                  <td className="p-4 text-text-secondary">{product.type}</td>
                  <td className="p-4 text-text-secondary">{product.sku}</td>
                  <td className="p-4 text-text-secondary">{product.size}</td>
                  <td className="p-4 text-text-secondary">KES {product.price.toLocaleString()}</td>
                  <td className="p-4 text-text-secondary">{product.stock}</td>
                  <td className="p-4 text-text-secondary">{product.category}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
                      {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => onEdit(product)}
                        className="p-2 text-text-secondary hover:text-white hover:bg-gray-800 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this product?')) {
                            deleteProduct(product.id);
                          }
                        }}
                        className="p-2 text-text-secondary hover:text-error hover:bg-gray-800 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
import React from 'react';
import { X, Plus, Minus, Loader2 } from 'lucide-react';
import { useProductStore } from '../../store/productStore';
import { useOrderStore } from '../../store/orderStore';
import type { PaymentMethod, DeliveryMode } from '../../types/orders';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderModal({ isOpen, onClose }: OrderModalProps) {
  const { products, fetchProducts, loading: productsLoading } = useProductStore();
  const { createOrder, loading: orderLoading } = useOrderStore();
  const [selectedProducts, setSelectedProducts] = React.useState([{ id: '', quantity: 1 }]);
  const [customerInfo, setCustomerInfo] = React.useState({
    name: '',
    phone: '',
    email: ''
  });
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('mpesa_stk');
  const [deliveryMode, setDeliveryMode] = React.useState<DeliveryMode>('boda');
  const [deliveryAddress, setDeliveryAddress] = React.useState('');
  const [deliveryNotes, setDeliveryNotes] = React.useState('');
  const [error, setError] = React.useState('');

  // Fetch products when modal opens
  React.useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen, fetchProducts]);

  const calculateTotal = () => {
    return selectedProducts.reduce((total, item) => {
      const product = products.find(p => p.id === item.id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const orderItems = selectedProducts
        .filter(item => item.id)
        .map(item => {
          const product = products.find(p => p.id === item.id);
          if (!product) throw new Error('Invalid product selected');
          
          // Check stock availability
          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
          }

          return {
            product_id: item.id,
            product_name: product.name, // Updated to match schema
            quantity: item.quantity,
            price: product.price
          };
        });

      if (orderItems.length === 0) {
        throw new Error('Please select at least one product');
      }

      const order = {
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_email: customerInfo.email || undefined,
        delivery_mode: deliveryMode,
        delivery_address: deliveryAddress,
        delivery_notes: deliveryNotes || undefined,
        total_amount: calculateTotal(),
        payment_method: paymentMethod,
        status: 'pending',
        payment_status: 'pending'
      };

      await createOrder(order, orderItems);
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-800 sticky top-0 bg-card">
          <h2 className="text-xl font-semibold text-white">Create New Order</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-900/30 border border-red-900 rounded-lg text-red-300">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Customer Name
              </label>
              <input
                type="text"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
                placeholder="Enter customer name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
                placeholder="Enter phone number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Payment Method
              </label>
              <select 
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-primary"
                required
              >
                <option value="mpesa_stk">M-Pesa (STK Push)</option>
                <option value="mpesa_link">M-Pesa (Payment Link)</option>
                <option value="mpesa_manual">M-Pesa (Manual)</option>
                <option value="card">Card Payment</option>
                <option value="cash">Cash</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-medium text-text-secondary">
                Products
              </label>
              <button
                type="button"
                onClick={() => setSelectedProducts([...selectedProducts, { id: '', quantity: 1 }])}
                className="text-primary hover:text-primary/90 text-sm font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Product
              </button>
            </div>
            
            <div className="space-y-4">
              {selectedProducts.map((product, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-1">
                    <select 
                      value={product.id}
                      onChange={(e) => {
                        const newProducts = [...selectedProducts];
                        newProducts[index].id = e.target.value;
                        setSelectedProducts(newProducts);
                      }}
                      className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-primary"
                      required
                      disabled={productsLoading}
                    >
                      <option value="">Select product</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id} disabled={p.stock === 0}>
                          {p.name} ({p.size}) - KES {p.price.toLocaleString()} {p.stock === 0 ? '(Out of Stock)' : `(${p.stock} in stock)`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      min="1"
                      max={product.id ? products.find(p => p.id === product.id)?.stock : undefined}
                      value={product.quantity}
                      onChange={(e) => {
                        const newProducts = [...selectedProducts];
                        newProducts[index].quantity = parseInt(e.target.value);
                        setSelectedProducts(newProducts);
                      }}
                      className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  {selectedProducts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setSelectedProducts(selectedProducts.filter((_, i) => i !== index))}
                      className="p-2 text-text-secondary hover:text-error hover:bg-gray-800 rounded-lg"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 text-right">
              <p className="text-text-secondary">
                Total: <span className="text-white font-medium">KES {calculateTotal().toLocaleString()}</span>
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Delivery Mode
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDeliveryMode('boda')}
                className={`p-4 rounded-lg border ${
                  deliveryMode === 'boda'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-800 text-text-secondary hover:border-primary'
                }`}
              >
                Boda Rider
              </button>
              <button
                type="button"
                onClick={() => setDeliveryMode('pickup')}
                className={`p-4 rounded-lg border ${
                  deliveryMode === 'pickup'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-800 text-text-secondary hover:border-primary'
                }`}
              >
                Pick up (Mtaani)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Delivery Address
            </label>
            <textarea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary h-24 resize-none"
              placeholder={deliveryMode === 'boda' 
                ? "Enter delivery address..."
                : "Enter preferred Mtaani pickup point..."
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Delivery Notes (Optional)
            </label>
            <textarea
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary h-24 resize-none"
              placeholder="Add any special delivery instructions..."
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-text-secondary hover:text-white border border-gray-800 rounded-lg hover:bg-gray-800"
              disabled={orderLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={orderLoading || productsLoading}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center disabled:opacity-50"
            >
              {(orderLoading || productsLoading) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
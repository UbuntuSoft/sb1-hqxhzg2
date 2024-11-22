import React from 'react';
import { MessageCircle, Share2, Eye, CreditCard, X } from 'lucide-react';
import PaymentVerificationModal from './PaymentVerificationModal';
import PaymentInitiationModal from './PaymentInitiationModal';
import { useOrderStore } from '../../store/orderStore';
import type { Order } from '../../types/orders';

const statusStyles = {
  pending: 'bg-yellow-900/30 text-yellow-300',
  confirmed: 'bg-blue-900/30 text-blue-300',
  dispatched: 'bg-purple-900/30 text-purple-300',
  delivered: 'bg-green-900/30 text-green-300',
  cancelled: 'bg-red-900/30 text-red-300'
};

const paymentStatusStyles = {
  pending: 'bg-yellow-900/30 text-yellow-300',
  paid: 'bg-green-900/30 text-green-300',
  refunded: 'bg-blue-900/30 text-blue-300',
  cancelled: 'bg-red-900/30 text-red-300'
};

interface OrderListProps {
  searchQuery: string;
}

export default function OrderList({ searchQuery }: OrderListProps) {
  const { orders, loading, error, deleteOrder } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
  const [isPaymentInitModalOpen, setIsPaymentInitModalOpen] = React.useState(false);

  const filteredOrders = React.useMemo(() => {
    return orders.filter(order =>
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [orders, searchQuery]);

  const handleShareOrderDetails = (order: Order) => {
    const message = `Hello ${order.customer_name},\n\n` +
      `Your order ${order.id} has been confirmed.\n\n` +
      `Order Details:\n` +
      `${order.items.map(item => `- ${item.product_name} x${item.quantity} - KES ${item.price.toLocaleString()}`).join('\n')}\n\n` +
      `Total: KES ${order.total_amount.toLocaleString()}\n\n` +
      `Payment Method: ${order.payment_method === 'mpesa_stk' ? 'M-Pesa STK Push' : 
        order.payment_method === 'mpesa_link' ? 'M-Pesa Payment Link' :
        order.payment_method === 'mpesa_manual' ? 'M-Pesa Manual Payment' :
        order.payment_method === 'card' ? 'Card Payment' : 'Cash'}\n\n` +
      `Delivery Details:\n` +
      `Mode: ${order.delivery_mode === 'boda' ? 'Boda Rider' : 'Mtaani Pickup'}\n` +
      `Address: ${order.delivery_address}\n` +
      (order.delivery_notes ? `Notes: ${order.delivery_notes}\n\n` : '\n') +
      `Thank you for shopping with us!`;

    window.open(`https://wa.me/${order.customer_phone}?text=${encodeURIComponent(message)}`);
  };

  const handleShareReceipt = (order: Order) => {
    const receipt = `*Receipt for Order ${order.id}*\n\n` +
      `Date: ${new Date(order.created_at).toLocaleDateString()}\n` +
      `Customer: ${order.customer_name}\n\n` +
      `Items:\n${order.items.map(item => `- ${item.product_name} x${item.quantity} - KES ${item.price.toLocaleString()}`).join('\n')}\n\n` +
      `Total Amount: KES ${order.total_amount.toLocaleString()}\n` +
      `Payment Method: ${order.payment_method.toUpperCase()}\n` +
      `${order.mpesa_code ? `Transaction ID: ${order.mpesa_code}\n` : ''}` +
      `Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}\n\n` +
      `Delivery Details:\n` +
      `Mode: ${order.delivery_mode === 'boda' ? 'Boda Rider' : 'Mtaani Pickup'}\n` +
      `Address: ${order.delivery_address}\n\n` +
      `Thank you for shopping with us!`;

    window.open(`https://wa.me/${order.customer_phone}?text=${encodeURIComponent(receipt)}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-900 text-red-300 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Error Loading Orders</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  if (filteredOrders.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-gray-800 p-8 text-center">
        <p className="text-text-secondary">No orders found</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-gray-800">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left p-4 text-text-secondary font-medium">Order ID</th>
              <th className="text-left p-4 text-text-secondary font-medium">Customer</th>
              <th className="text-left p-4 text-text-secondary font-medium">Items</th>
              <th className="text-left p-4 text-text-secondary font-medium">Total</th>
              <th className="text-left p-4 text-text-secondary font-medium">Status</th>
              <th className="text-left p-4 text-text-secondary font-medium">Payment</th>
              <th className="text-right p-4 text-text-secondary font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-surface/50">
                <td className="p-4">
                  <span className="text-white font-medium">{order.id.slice(-8)}</span>
                  <div className="text-sm text-text-secondary">
                    {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-white">{order.customer_name}</div>
                  <div className="text-sm text-text-secondary">{order.customer_phone}</div>
                </td>
                <td className="p-4">
                  <div className="text-white">{order.items.length} items</div>
                  <div className="text-sm text-text-secondary">
                    {order.items.map(item => `${item.quantity}x ${item.product_name}`).join(', ')}
                  </div>
                </td>
                <td className="p-4 text-white">
                  KES {order.total_amount.toLocaleString()}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[order.status]}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${paymentStatusStyles[order.payment_status]}`}>
                    {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleShareOrderDetails(order)}
                      className="p-2 text-text-secondary hover:text-white hover:bg-gray-800 rounded-lg"
                      title="Share Order Details"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    {order.payment_status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsPaymentInitModalOpen(true);
                          }}
                          className="p-2 text-text-secondary hover:text-white hover:bg-gray-800 rounded-lg"
                          title="Initiate Payment"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsPaymentModalOpen(true);
                          }}
                          className="p-2 text-text-secondary hover:text-white hover:bg-gray-800 rounded-lg"
                          title="Verify Payment"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {order.payment_status === 'paid' && (
                      <button 
                        onClick={() => handleShareReceipt(order)}
                        className="p-2 text-text-secondary hover:text-white hover:bg-gray-800 rounded-lg"
                        title="Share Receipt"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    )}
                    {order.status === 'pending' && (
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to cancel this order?')) {
                            deleteOrder(order.id);
                          }
                        }}
                        className="p-2 text-text-secondary hover:text-error hover:bg-gray-800 rounded-lg"
                        title="Cancel Order"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <>
          <PaymentVerificationModal
            isOpen={isPaymentModalOpen}
            onClose={() => {
              setIsPaymentModalOpen(false);
              setSelectedOrder(null);
            }}
            orderId={selectedOrder.id}
            total={selectedOrder.total_amount}
          />
          <PaymentInitiationModal
            isOpen={isPaymentInitModalOpen}
            onClose={() => {
              setIsPaymentInitModalOpen(false);
              setSelectedOrder(null);
            }}
            order={selectedOrder}
          />
        </>
      )}
    </div>
  );
}
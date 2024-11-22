import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { usePaymentStore } from '../../store/paymentStore';
import type { Order } from '../../types/orders';

interface PaymentInitiationModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

export default function PaymentInitiationModal({ isOpen, onClose, order }: PaymentInitiationModalProps) {
  const { initiatePayment, loading } = usePaymentStore();
  const [error, setError] = React.useState('');

  const handleInitiatePayment = async () => {
    try {
      setError('');
      
      if (!order.customer_phone && order.payment_method === 'mpesa_stk') {
        throw new Error('Phone number is required for M-Pesa STK push');
      }

      const response = await initiatePayment({
        amount: order.total_amount,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        customerEmail: order.customer_email,
        reference: order.id,
        paymentMethod: order.payment_method
      });

      if (response.paymentUrl) {
        // For M-Pesa payment link or card payment
        window.open(response.paymentUrl, '_blank');
      }

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to initiate payment');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Initiate Payment</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-900/30 border border-red-900 rounded-lg text-red-300">
              {error}
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium text-white mb-4">
              Payment Details
            </h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-text-secondary">Amount</dt>
                <dd className="text-white font-medium">
                  KES {order.total_amount.toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-text-secondary">Customer</dt>
                <dd className="text-white">{order.customer_name}</dd>
              </div>
              <div>
                <dt className="text-sm text-text-secondary">Phone</dt>
                <dd className="text-white">{order.customer_phone}</dd>
              </div>
              {order.customer_email && (
                <div>
                  <dt className="text-sm text-text-secondary">Email</dt>
                  <dd className="text-white">{order.customer_email}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm text-text-secondary">Payment Method</dt>
                <dd className="text-white">
                  {order.payment_method === 'mpesa_stk' && 'M-Pesa STK Push'}
                  {order.payment_method === 'mpesa_link' && 'M-Pesa Payment Link'}
                  {order.payment_method === 'mpesa_manual' && 'M-Pesa Manual Payment'}
                  {order.payment_method === 'card' && 'Card Payment'}
                  {order.payment_method === 'cash' && 'Cash'}
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-text-secondary hover:text-white border border-gray-800 rounded-lg hover:bg-gray-800"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleInitiatePayment}
              disabled={loading}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? 'Processing...' : 'Initiate Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { usePaymentStore } from '../../store/paymentStore';

interface PaymentInitiationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  amount: number;
}

export default function PaymentInitiationModal({
  isOpen,
  onClose,
  orderId,
  amount
}: PaymentInitiationModalProps) {
  const { initiatePayment, loading } = usePaymentStore();
  const [paymentMethod, setPaymentMethod] = React.useState<'mpesa_stk' | 'mpesa_link' | 'card'>('mpesa_stk');
  const [customerName, setCustomerName] = React.useState('');
  const [customerPhone, setCustomerPhone] = React.useState('');
  const [customerEmail, setCustomerEmail] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await initiatePayment({
        amount,
        customerName,
        customerPhone,
        customerEmail,
        reference: orderId || `ORDER-${Date.now()}`,
        paymentMethod
      });

      if (response.paymentUrl) {
        window.open(response.paymentUrl, '_blank');
      }

      onClose();
    } catch (err: any) {
      setError(err.message);
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-900/30 border border-red-900 rounded-lg text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('mpesa_stk')}
                className={`p-4 rounded-lg border ${
                  paymentMethod === 'mpesa_stk'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-800 text-text-secondary hover:border-primary'
                }`}
              >
                STK Push
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('mpesa_link')}
                className={`p-4 rounded-lg border ${
                  paymentMethod === 'mpesa_link'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-800 text-text-secondary hover:border-primary'
                }`}
              >
                Payment Link
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-lg border ${
                  paymentMethod === 'card'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-800 text-text-secondary hover:border-primary'
                }`}
              >
                Card
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Customer Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
              placeholder="Enter customer name"
              required
            />
          </div>

          {(paymentMethod === 'mpesa_stk' || paymentMethod === 'mpesa_link') && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
                placeholder="Enter phone number"
                required={paymentMethod === 'mpesa_stk'}
              />
            </div>
          )}

          {paymentMethod === 'card' && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
                placeholder="Enter email address"
                required={paymentMethod === 'card'}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Amount
            </label>
            <div className="px-4 py-2 bg-background border border-gray-800 rounded-lg text-white">
              KES {amount.toLocaleString()}
            </div>
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
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? 'Processing...' : 'Initiate Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
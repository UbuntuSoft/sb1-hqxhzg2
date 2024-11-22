import React from 'react';
import { X, Download, ExternalLink, RefreshCw } from 'lucide-react';
import { usePaymentStore } from '../../store/paymentStore';

interface PaymentDetailsModalProps {
  payment: any;
  onClose: () => void;
}

export default function PaymentDetailsModal({ payment, onClose }: PaymentDetailsModalProps) {
  const { updatePaymentStatus } = usePaymentStore();
  const [loading, setLoading] = React.useState(false);

  const handleRefreshStatus = async () => {
    if (payment.status !== 'pending') return;
    
    setLoading(true);
    try {
      // TODO: Implement status check
      await new Promise(resolve => setTimeout(resolve, 1000));
      await updatePaymentStatus(payment.id, 'completed');
    } catch (error) {
      console.error('Error refreshing status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl w-full max-w-lg mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Payment Details</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-text-secondary">Reference</p>
              <p className="text-white">{payment.reference}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Amount</p>
              <p className="text-white">KES {payment.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Customer</p>
              <p className="text-white">{payment.customer_name}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Contact</p>
              <p className="text-white">
                {payment.customer_phone || payment.customer_email}
              </p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Payment Method</p>
              <p className="text-white">
                {payment.payment_method === 'mpesa_stk' && 'M-Pesa STK'}
                {payment.payment_method === 'mpesa_link' && 'M-Pesa Link'}
                {payment.payment_method === 'card' && 'Card Payment'}
              </p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Date</p>
              <p className="text-white">
                {new Date(payment.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          {payment.mpesa_receipt && (
            <div>
              <p className="text-sm text-text-secondary">M-Pesa Receipt</p>
              <p className="text-white">{payment.mpesa_receipt}</p>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-800">
            {payment.status === 'pending' && (
              <button
                onClick={handleRefreshStatus}
                disabled={loading}
                className="flex items-center px-4 py-2 text-text-secondary border border-gray-800 rounded-lg hover:bg-gray-800"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Check Status
              </button>
            )}
            {payment.status === 'completed' && (
              <button className="flex items-center px-4 py-2 text-text-secondary border border-gray-800 rounded-lg hover:bg-gray-800">
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </button>
            )}
            {payment.payment_method === 'mpesa_link' && (
              <button className="flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg">
                <ExternalLink className="w-4 h-4 mr-2" />
                Copy Payment Link
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
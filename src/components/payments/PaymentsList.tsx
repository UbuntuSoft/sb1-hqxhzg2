import React from 'react';
import { Eye, Download, ExternalLink } from 'lucide-react';
import { usePaymentStore } from '../../store/paymentStore';
import PaymentDetailsModal from './PaymentDetailsModal';

interface PaymentsListProps {
  searchQuery: string;
  dateRange: string;
}

const statusStyles = {
  pending: 'bg-yellow-900/30 text-yellow-300',
  completed: 'bg-green-900/30 text-green-300',
  failed: 'bg-red-900/30 text-red-300'
};

export default function PaymentsList({ searchQuery, dateRange }: PaymentsListProps) {
  const { payments, loading, error } = usePaymentStore();
  const [selectedPayment, setSelectedPayment] = React.useState<any>(null);

  const filteredPayments = React.useMemo(() => {
    return payments.filter(payment => {
      const matchesSearch = 
        payment.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (payment.mpesa_receipt?.toLowerCase() || '').includes(searchQuery.toLowerCase());

      if (dateRange === 'today') {
        const today = new Date().toISOString().split('T')[0];
        return matchesSearch && payment.created_at.startsWith(today);
      }

      if (dateRange === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return matchesSearch && new Date(payment.created_at) >= weekAgo;
      }

      if (dateRange === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return matchesSearch && new Date(payment.created_at) >= monthAgo;
      }

      if (dateRange === 'year') {
        const yearAgo = new Date();
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        return matchesSearch && new Date(payment.created_at) >= yearAgo;
      }

      return matchesSearch;
    });
  }, [payments, searchQuery, dateRange]);

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
        <div className="text-error text-center">{error.message}</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card rounded-xl border border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left p-4 text-text-secondary font-medium">Date</th>
                <th className="text-left p-4 text-text-secondary font-medium">Reference</th>
                <th className="text-left p-4 text-text-secondary font-medium">Customer</th>
                <th className="text-left p-4 text-text-secondary font-medium">Method</th>
                <th className="text-left p-4 text-text-secondary font-medium">Amount</th>
                <th className="text-left p-4 text-text-secondary font-medium">Status</th>
                <th className="text-right p-4 text-text-secondary font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-surface/50">
                  <td className="p-4 text-white">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-white">{payment.reference}</td>
                  <td className="p-4">
                    <div>
                      <div className="text-white">{payment.customer_name}</div>
                      <div className="text-sm text-text-secondary">
                        {payment.customer_phone || payment.customer_email}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-text-secondary">
                    {payment.payment_method === 'mpesa_stk' && 'M-Pesa STK'}
                    {payment.payment_method === 'mpesa_link' && 'M-Pesa Link'}
                    {payment.payment_method === 'card' && 'Card Payment'}
                  </td>
                  <td className="p-4 text-white">
                    KES {payment.amount.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusStyles[payment.status as keyof typeof statusStyles]
                    }`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="p-2 text-text-secondary hover:text-white hover:bg-gray-800 rounded-lg"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {payment.status === 'completed' && (
                        <button
                          className="p-2 text-text-secondary hover:text-white hover:bg-gray-800 rounded-lg"
                          title="Download Receipt"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      {payment.payment_method === 'mpesa_link' && payment.status === 'pending' && (
                        <button
                          className="p-2 text-text-secondary hover:text-white hover:bg-gray-800 rounded-lg"
                          title="Copy Payment Link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </>
  );
}
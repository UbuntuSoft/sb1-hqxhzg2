import React from 'react';
import { DollarSign, CreditCard, CheckCircle2, XCircle } from 'lucide-react';
import StatCard from '../StatCard';
import { usePaymentStore } from '../../store/paymentStore';

export default function PaymentStats() {
  const { payments } = usePaymentStore();

  const stats = React.useMemo(() => {
    const total = payments.reduce((sum, p) => sum + p.amount, 0);
    const completed = payments.filter(p => p.status === 'completed').length;
    const failed = payments.filter(p => p.status === 'failed').length;
    const pending = payments.filter(p => p.status === 'pending').length;

    return [
      {
        title: 'Total Revenue',
        value: `KES ${total.toLocaleString()}`,
        icon: DollarSign,
        trend: { value: 15, isPositive: true }
      },
      {
        title: 'Successful Payments',
        value: completed.toString(),
        icon: CheckCircle2,
        trend: { value: 8, isPositive: true }
      },
      {
        title: 'Failed Payments',
        value: failed.toString(),
        icon: XCircle,
        trend: { value: 3, isPositive: false }
      },
      {
        title: 'Pending Payments',
        value: pending.toString(),
        icon: CreditCard,
        trend: { value: 5, isPositive: true }
      }
    ];
  }, [payments]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
import React from 'react';
import { DollarSign, TrendingUp, CreditCard, Receipt } from 'lucide-react';
import StatCard from '../StatCard';

const metrics = [
  {
    title: 'Total Revenue',
    value: 'KES 850,000',
    icon: DollarSign,
    trend: { value: 15, isPositive: true }
  },
  {
    title: 'Net Profit',
    value: 'KES 320,000',
    icon: TrendingUp,
    trend: { value: 12, isPositive: true }
  },
  {
    title: 'Outstanding Credit',
    value: 'KES 45,000',
    icon: CreditCard,
    trend: { value: 8, isPositive: false }
  },
  {
    title: 'Expenses',
    value: 'KES 185,000',
    icon: Receipt,
    trend: { value: 5, isPositive: false }
  }
];

export default function FinancialMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <StatCard key={metric.title} {...metric} />
      ))}
    </div>
  );
}
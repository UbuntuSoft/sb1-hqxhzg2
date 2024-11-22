import React from 'react';
import { Users, UserPlus, Repeat, DollarSign } from 'lucide-react';
import StatCard from '../StatCard';

const metrics = [
  {
    title: 'Total Customers',
    value: '248',
    icon: Users,
    trend: { value: 12, isPositive: true }
  },
  {
    title: 'New Customers',
    value: '32',
    icon: UserPlus,
    trend: { value: 8, isPositive: true }
  },
  {
    title: 'Repeat Customers',
    value: '65%',
    icon: Repeat,
    trend: { value: 5, isPositive: true }
  },
  {
    title: 'Avg. Order Value',
    value: 'KES 28,500',
    icon: DollarSign,
    trend: { value: 15, isPositive: true }
  }
];

export default function CustomerMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {metrics.map((metric) => (
        <StatCard key={metric.title} {...metric} />
      ))}
    </div>
  );
}
import React from 'react';
import { Package, AlertTriangle, TrendingDown, Boxes } from 'lucide-react';
import StatCard from '../StatCard';

const metrics = [
  {
    title: 'Total Products',
    value: '156',
    icon: Package,
    trend: { value: 8, isPositive: true }
  },
  {
    title: 'Low Stock Items',
    value: '12',
    icon: AlertTriangle,
    trend: { value: 3, isPositive: false }
  },
  {
    title: 'Out of Stock',
    value: '5',
    icon: TrendingDown,
    trend: { value: 2, isPositive: false }
  },
  {
    title: 'Stock Value',
    value: 'KES 4.2M',
    icon: Boxes,
    trend: { value: 10, isPositive: true }
  }
];

export default function InventoryMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {metrics.map((metric) => (
        <StatCard key={metric.title} {...metric} />
      ))}
    </div>
  );
}
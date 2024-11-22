import React from 'react';
import { DollarSign, Package, Users, TrendingUp } from 'lucide-react';
import StatCard from '../components/StatCard';
import RecentOrders from '../components/RecentOrders';

const mockOrders = [
  {
    id: '1',
    customer: 'John Kamau',
    items: 2,
    total: 27500,
    status: 'pending' as const,
    date: '2h ago',
  },
  {
    id: '2',
    customer: 'Mary Wanjiku',
    items: 1,
    total: 15000,
    status: 'processing' as const,
    date: '3h ago',
  },
  {
    id: '3',
    customer: 'Peter Omondi',
    items: 3,
    total: 42000,
    status: 'delivered' as const,
    date: '5h ago',
  },
];

export default function Overview() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Perfume Shop Dashboard</h1>
        <p className="mt-1 text-text-secondary">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Today's Sales"
          value="KES 84,500"
          icon={DollarSign}
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Active Orders"
          value="12"
          icon={Package}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="New Customers"
          value="7"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Revenue Growth"
          value="18%"
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders orders={mockOrders} />
      </div>
    </div>
  );
}
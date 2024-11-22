import React from 'react';
import { Package } from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: 'pending' | 'processing' | 'delivered';
  date: string;
}

const statusStyles = {
  pending: 'bg-yellow-900/30 text-yellow-300',
  processing: 'bg-blue-900/30 text-blue-300',
  delivered: 'bg-green-900/30 text-green-300',
};

export default function RecentOrders({ orders }: { orders: Order[] }) {
  return (
    <div className="bg-card rounded-xl border border-gray-800">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
          <Package className="h-5 w-5 text-text-secondary" />
        </div>
      </div>
      <div className="divide-y divide-gray-800">
        {orders.map((order) => (
          <div key={order.id} className="p-6 hover:bg-surface/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">{order.customer}</p>
                <p className="text-sm text-text-secondary mt-1">
                  {order.items} items · KES {order.total.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusStyles[order.status]
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span className="text-sm text-text-secondary">{order.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
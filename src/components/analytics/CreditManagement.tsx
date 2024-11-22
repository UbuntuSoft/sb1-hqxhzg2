import React from 'react';
import { CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface CreditEntry {
  id: string;
  type: 'given' | 'taken';
  entity: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'overdue' | 'paid';
}

const mockCredits: CreditEntry[] = [
  {
    id: 'CR001',
    type: 'given',
    entity: 'John Kamau',
    amount: 25000,
    dueDate: '2024-03-30',
    status: 'pending'
  },
  {
    id: 'CR002',
    type: 'taken',
    entity: 'Luxury Perfumes Ltd',
    amount: 45000,
    dueDate: '2024-03-25',
    status: 'overdue'
  },
  {
    id: 'CR003',
    type: 'given',
    entity: 'Sarah Njeri',
    amount: 15000,
    dueDate: '2024-04-05',
    status: 'pending'
  }
];

const statusStyles = {
  pending: 'bg-yellow-900/30 text-yellow-300',
  overdue: 'bg-red-900/30 text-red-300',
  paid: 'bg-green-900/30 text-green-300'
};

export default function CreditManagement() {
  return (
    <div className="bg-card rounded-xl border border-gray-800">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">Credit Management</h3>
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <button className="text-primary hover:text-primary/90 text-sm font-medium">
            View All
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-800">
        {mockCredits.map((credit) => (
          <div key={credit.id} className="p-6 hover:bg-surface/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {credit.type === 'given' ? (
                  <ArrowUpRight className="w-5 h-5 text-success" />
                ) : (
                  <ArrowDownRight className="w-5 h-5 text-error" />
                )}
                <div>
                  <p className="font-medium text-white">{credit.entity}</p>
                  <p className="text-sm text-text-secondary">Due: {credit.dueDate}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-white">
                  KES {credit.amount.toLocaleString()}
                </p>
                <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                  statusStyles[credit.status]
                }`}>
                  {credit.status.charAt(0).toUpperCase() + credit.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
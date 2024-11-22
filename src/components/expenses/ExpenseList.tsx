import React from 'react';
import { Edit2, Trash2, Receipt } from 'lucide-react';

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  reference: string;
  status: 'pending' | 'paid' | 'cancelled';
  attachments?: string[];
}

const mockExpenses: Expense[] = [
  {
    id: 'EXP-001',
    date: '2024-03-15',
    category: 'Inventory',
    description: 'Perfume stock purchase from Luxury Perfumes Ltd',
    amount: 250000,
    paymentMethod: 'Bank Transfer',
    reference: 'INV-2024-001',
    status: 'paid'
  },
  {
    id: 'EXP-002',
    date: '2024-03-14',
    category: 'Marketing',
    description: 'Social media advertising campaign',
    amount: 15000,
    paymentMethod: 'M-Pesa',
    reference: 'MKT-2024-015',
    status: 'paid'
  },
  {
    id: 'EXP-003',
    date: '2024-03-13',
    category: 'Utilities',
    description: 'Electricity bill for March',
    amount: 8500,
    paymentMethod: 'M-Pesa',
    reference: 'UTIL-2024-003',
    status: 'pending'
  },
  {
    id: 'EXP-004',
    date: '2024-03-12',
    category: 'Rent',
    description: 'Shop rent for March',
    amount: 45000,
    paymentMethod: 'Bank Transfer',
    reference: 'RENT-2024-003',
    status: 'paid'
  },
  {
    id: 'EXP-005',
    date: '2024-03-11',
    category: 'Delivery',
    description: 'Rider payments for last week',
    amount: 12000,
    paymentMethod: 'M-Pesa',
    reference: 'DEL-2024-010',
    status: 'paid'
  }
];

const statusStyles = {
  pending: 'bg-yellow-900/30 text-yellow-300',
  paid: 'bg-green-900/30 text-green-300',
  cancelled: 'bg-red-900/30 text-red-300'
};

interface ExpenseListProps {
  searchQuery: string;
}

export default function ExpenseList({ searchQuery }: ExpenseListProps) {
  const filteredExpenses = mockExpenses.filter(expense =>
    expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-card rounded-xl border border-gray-800">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left p-4 text-text-secondary font-medium">Date</th>
              <th className="text-left p-4 text-text-secondary font-medium">Category</th>
              <th className="text-left p-4 text-text-secondary font-medium">Description</th>
              <th className="text-left p-4 text-text-secondary font-medium">Amount</th>
              <th className="text-left p-4 text-text-secondary font-medium">Payment Method</th>
              <th className="text-left p-4 text-text-secondary font-medium">Reference</th>
              <th className="text-left p-4 text-text-secondary font-medium">Status</th>
              <th className="text-right p-4 text-text-secondary font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredExpenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-surface/50">
                <td className="p-4 text-white">{expense.date}</td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-background rounded-lg text-text-secondary text-sm">
                    {expense.category}
                  </span>
                </td>
                <td className="p-4 text-white">{expense.description}</td>
                <td className="p-4 text-white">KES {expense.amount.toLocaleString()}</td>
                <td className="p-4 text-text-secondary">{expense.paymentMethod}</td>
                <td className="p-4 text-text-secondary">{expense.reference}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[expense.status]}`}>
                    {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-end space-x-2">
                    <button className="p-2 text-text-secondary hover:text-white hover:bg-gray-800 rounded-lg">
                      <Receipt className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-text-secondary hover:text-white hover:bg-gray-800 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-text-secondary hover:text-error hover:bg-gray-800 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
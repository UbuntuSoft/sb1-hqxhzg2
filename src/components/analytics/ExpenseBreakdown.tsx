import React from 'react';
import { PieChart, DollarSign } from 'lucide-react';

const expenses = [
  { category: 'Inventory Purchases', amount: 120000, color: 'bg-blue-500' },
  { category: 'Marketing', amount: 25000, color: 'bg-green-500' },
  { category: 'Rent', amount: 20000, color: 'bg-yellow-500' },
  { category: 'Utilities', amount: 15000, color: 'bg-purple-500' },
  { category: 'Other', amount: 5000, color: 'bg-red-500' }
];

export default function ExpenseBreakdown() {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="bg-card rounded-xl border border-gray-800 p-6">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-lg font-semibold text-white">Expense Breakdown</h3>
        <PieChart className="w-5 h-5 text-primary" />
      </div>

      <div className="space-y-4">
        {expenses.map((expense) => (
          <div key={expense.category} className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${expense.color} mr-3`} />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-white">{expense.category}</span>
                <span className="text-text-secondary">
                  KES {expense.amount.toLocaleString()}
                </span>
              </div>
              <div className="mt-1 bg-background rounded-full h-2">
                <div
                  className={`h-full rounded-full ${expense.color}`}
                  style={{ width: `${(expense.amount / total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-800">
        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Total Expenses</span>
          <div className="flex items-center text-white font-semibold">
            <DollarSign className="w-4 h-4 mr-1" />
            KES {total.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
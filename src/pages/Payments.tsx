import React from 'react';
import { Search, Filter, Download } from 'lucide-react';
import PaymentsList from '../components/payments/PaymentsList';
import PaymentStats from '../components/payments/PaymentStats';

export default function Payments() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [dateRange, setDateRange] = React.useState('all');

  const handleExport = () => {
    // TODO: Implement CSV export
    alert('Exporting payments data...');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Payment Transactions</h1>
          <p className="mt-1 text-text-secondary">Monitor and manage your payment transactions</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </button>
      </div>

      <PaymentStats />

      <div className="bg-card rounded-xl border border-gray-800 mb-6">
        <div className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-gray-800 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-primary"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <button className="flex items-center px-4 py-2 text-text-secondary border border-gray-800 rounded-lg hover:bg-gray-800">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </button>
          </div>
        </div>
      </div>

      <PaymentsList searchQuery={searchQuery} dateRange={dateRange} />
    </div>
  );
}
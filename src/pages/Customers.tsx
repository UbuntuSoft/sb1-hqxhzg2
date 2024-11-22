import React from 'react';
import { Search, Filter } from 'lucide-react';
import CustomerList from '../components/customers/CustomerList';
import { useCustomerStore } from '../store/customerStore';

export default function Customers() {
  const { fetchCustomers } = useCustomerStore();
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Customer Management</h1>
          <p className="mt-1 text-text-secondary">View and manage your customer relationships</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-gray-800 mb-6">
        <div className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-gray-800 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
            />
          </div>
          <button className="flex items-center px-4 py-2 text-text-secondary border border-gray-800 rounded-lg hover:bg-gray-800">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </button>
        </div>
      </div>

      <CustomerList searchQuery={searchQuery} />
    </div>
  );
}
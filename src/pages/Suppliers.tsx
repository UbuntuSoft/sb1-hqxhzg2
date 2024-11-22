import React from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import SupplierList from '../components/suppliers/SupplierList';
import SupplierModal from '../components/suppliers/SupplierModal';

export default function Suppliers() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Supplier Management</h1>
          <p className="mt-1 text-text-secondary">Manage your supplier relationships</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Supplier
        </button>
      </div>

      <div className="bg-card rounded-xl border border-gray-800 mb-6">
        <div className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
            <input
              type="text"
              placeholder="Search suppliers..."
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

      <SupplierList searchQuery={searchQuery} />
      <SupplierModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
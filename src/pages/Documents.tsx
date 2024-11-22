import React from 'react';
import { Plus, Search, Filter, FileText, Download } from 'lucide-react';

export default function Documents() {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Documents & Records</h1>
          <p className="mt-1 text-text-secondary">Manage your business documents</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Upload Document
        </button>
      </div>

      <div className="bg-card rounded-xl border border-gray-800 mb-6">
        <div className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
            <input
              type="text"
              placeholder="Search documents..."
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example Document Cards */}
        <div className="bg-card rounded-xl border border-gray-800 p-6 hover:border-primary transition-colors">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <button className="text-text-secondary hover:text-white">
              <Download className="w-5 h-5" />
            </button>
          </div>
          <h3 className="mt-4 font-medium text-white">March 2024 Sales Report</h3>
          <p className="mt-1 text-sm text-text-secondary">PDF · 2.4 MB</p>
          <p className="mt-4 text-xs text-text-secondary">Last modified: March 15, 2024</p>
        </div>

        <div className="bg-card rounded-xl border border-gray-800 p-6 hover:border-primary transition-colors">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <button className="text-text-secondary hover:text-white">
              <Download className="w-5 h-5" />
            </button>
          </div>
          <h3 className="mt-4 font-medium text-white">Supplier Contracts</h3>
          <p className="mt-1 text-sm text-text-secondary">PDF · 1.8 MB</p>
          <p className="mt-4 text-xs text-text-secondary">Last modified: March 10, 2024</p>
        </div>

        <div className="bg-card rounded-xl border border-gray-800 p-6 hover:border-primary transition-colors">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <button className="text-text-secondary hover:text-white">
              <Download className="w-5 h-5" />
            </button>
          </div>
          <h3 className="mt-4 font-medium text-white">Inventory Report Q1</h3>
          <p className="mt-1 text-sm text-text-secondary">XLSX · 856 KB</p>
          <p className="mt-4 text-xs text-text-secondary">Last modified: March 1, 2024</p>
        </div>
      </div>
    </div>
  );
}
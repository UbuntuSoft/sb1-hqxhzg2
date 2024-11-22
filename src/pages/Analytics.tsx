import React from 'react';
import { Calendar, Download } from 'lucide-react';
import SalesChart from '../components/analytics/SalesChart';
import TopProducts from '../components/analytics/TopProducts';
import CustomerMetrics from '../components/analytics/CustomerMetrics';
import InventoryMetrics from '../components/analytics/InventoryMetrics';
import FinancialMetrics from '../components/analytics/FinancialMetrics';
import ExpenseBreakdown from '../components/analytics/ExpenseBreakdown';
import CreditManagement from '../components/analytics/CreditManagement';

export default function Analytics() {
  const [dateRange, setDateRange] = React.useState('This Month');

  const handleExportReport = () => {
    // In a real implementation, this would generate and download a PDF report
    alert('Generating report...');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics & Reports</h1>
          <p className="mt-1 text-text-secondary">Track your business performance</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-background border border-gray-800 rounded-lg px-4 py-2 pr-8 text-white focus:outline-none focus:border-primary"
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
            </select>
            <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
          </div>
          <button 
            onClick={handleExportReport}
            className="flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <FinancialMetrics />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesChart />
          <ExpenseBreakdown />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CustomerMetrics />
          <InventoryMetrics />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopProducts type="sales" />
          <CreditManagement />
        </div>
      </div>
    </div>
  );
}
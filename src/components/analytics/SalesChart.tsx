import React from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const mockData = {
  currentMonth: 850000,
  lastMonth: 720000,
  percentageChange: 18.06,
  chartData: [
    { date: '1 Mar', sales: 25000 },
    { date: '5 Mar', sales: 32000 },
    { date: '10 Mar', sales: 28000 },
    { date: '15 Mar', sales: 45000 },
    { date: '20 Mar', sales: 38000 },
    { date: '25 Mar', sales: 42000 },
    { date: '30 Mar', sales: 35000 },
  ]
};

export default function SalesChart() {
  const maxSales = Math.max(...mockData.chartData.map(d => d.sales));
  const isPositiveGrowth = mockData.percentageChange > 0;

  return (
    <div className="bg-card rounded-xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">Sales Overview</h3>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-white">
              KES {mockData.currentMonth.toLocaleString()}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`flex items-center text-sm ${isPositiveGrowth ? 'text-success' : 'text-error'}`}>
                {isPositiveGrowth ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {Math.abs(mockData.percentageChange)}%
              </span>
              <span className="text-text-secondary text-sm">vs last month</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-64 flex items-end gap-2">
        {mockData.chartData.map((data, index) => (
          <div
            key={data.date}
            className="flex-1 flex flex-col items-center gap-2"
          >
            <div
              className="w-full bg-primary/20 rounded-t-lg relative group"
              style={{ height: `${(data.sales / maxSales) * 100}%` }}
            >
              <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg" />
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                KES {data.sales.toLocaleString()}
              </div>
            </div>
            <span className="text-text-secondary text-xs">{data.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
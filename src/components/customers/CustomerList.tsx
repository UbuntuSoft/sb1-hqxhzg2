import React from 'react';
import { MessageCircle, User, Calendar, ShoppingBag } from 'lucide-react';
import { useCustomerStore } from '../../store/customerStore';

const statusStyles = {
  active: 'bg-green-900/30 text-green-300',
  inactive: 'bg-gray-900/30 text-gray-300'
};

interface CustomerListProps {
  searchQuery: string;
}

export default function CustomerList({ searchQuery }: CustomerListProps) {
  const { customers, loading, error } = useCustomerStore();

  const filteredCustomers = React.useMemo(() => {
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [customers, searchQuery]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-900 text-red-300 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Error Loading Customers</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  if (filteredCustomers.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-gray-800 p-8 text-center">
        <p className="text-text-secondary">No customers found</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-gray-800">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left p-4 text-text-secondary font-medium">Customer</th>
              <th className="text-left p-4 text-text-secondary font-medium">Contact</th>
              <th className="text-left p-4 text-text-secondary font-medium">Orders</th>
              <th className="text-left p-4 text-text-secondary font-medium">Total Spent</th>
              <th className="text-left p-4 text-text-secondary font-medium">Last Order</th>
              <th className="text-left p-4 text-text-secondary font-medium">Status</th>
              <th className="text-right p-4 text-text-secondary font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-surface/50">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{customer.name}</div>
                      <div className="flex items-center text-sm text-text-secondary">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(customer.joinDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-white">{customer.email}</div>
                  <div className="text-sm text-text-secondary">{customer.phone}</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center text-white">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {customer.totalOrders}
                  </div>
                </td>
                <td className="p-4 text-white">
                  KES {customer.totalSpent.toLocaleString()}
                </td>
                <td className="p-4 text-white">
                  {new Date(customer.lastOrder).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[customer.status]}`}>
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-end">
                    <button
                      onClick={() => window.open(`https://wa.me/${customer.phone}`, '_blank')}
                      className="p-2 text-text-secondary hover:text-white hover:bg-gray-800 rounded-lg"
                      title="Send Message"
                    >
                      <MessageCircle className="w-4 h-4" />
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
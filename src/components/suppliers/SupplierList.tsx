import React from 'react';
import { MessageCircle, Edit2, Trash2, ExternalLink } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  brands: string[];
  totalOrders: number;
  lastOrder: string;
  status: 'active' | 'inactive';
  paymentTerms: string;
  website?: string;
}

const mockSuppliers: Supplier[] = [
  {
    id: 'SUP-001',
    name: 'Luxury Perfumes Ltd',
    contactPerson: 'David Maina',
    email: 'david@luxuryperfumes.co.ke',
    phone: '+254711223344',
    location: 'Westlands, Nairobi',
    brands: ['Chanel', 'Dior', 'Tom Ford'],
    totalOrders: 12,
    lastOrder: '2024-03-10',
    status: 'active',
    paymentTerms: 'Net 30',
    website: 'https://luxuryperfumes.co.ke'
  },
  {
    id: 'SUP-002',
    name: 'Premium Scents EA',
    contactPerson: 'Alice Wanjiku',
    email: 'alice@premiumscents.com',
    phone: '+254722334455',
    location: 'Kilimani, Nairobi',
    brands: ['Creed', 'Armani', 'Lancôme'],
    totalOrders: 8,
    lastOrder: '2024-03-15',
    status: 'active',
    paymentTerms: 'Net 15'
  }
];

const statusStyles = {
  active: 'bg-green-900/30 text-green-300',
  inactive: 'bg-gray-900/30 text-gray-300'
};

interface SupplierListProps {
  searchQuery: string;
}

export default function SupplierList({ searchQuery }: SupplierListProps) {
  const filteredSuppliers = mockSuppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-card rounded-xl border border-gray-800">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left p-4 text-text-secondary font-medium">Supplier</th>
              <th className="text-left p-4 text-text-secondary font-medium">Contact</th>
              <th className="text-left p-4 text-text-secondary font-medium">Brands</th>
              <th className="text-left p-4 text-text-secondary font-medium">Orders</th>
              <th className="text-left p-4 text-text-secondary font-medium">Payment Terms</th>
              <th className="text-left p-4 text-text-secondary font-medium">Status</th>
              <th className="text-right p-4 text-text-secondary font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredSuppliers.map((supplier) => (
              <tr key={supplier.id} className="hover:bg-surface/50">
                <td className="p-4">
                  <div>
                    <div className="font-medium text-white">{supplier.name}</div>
                    <div className="text-sm text-text-secondary">{supplier.location}</div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-white">{supplier.contactPerson}</div>
                  <div className="text-sm text-text-secondary">{supplier.phone}</div>
                  <div className="text-sm text-text-secondary">{supplier.email}</div>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {supplier.brands.map((brand) => (
                      <span
                        key={brand}
                        className="px-2 py-1 text-xs bg-background rounded-lg text-text-secondary"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-white">{supplier.totalOrders} orders</div>
                  <div className="text-sm text-text-secondary">Last: {supplier.lastOrder}</div>
                </td>
                <td className="p-4 text-white">{supplier.paymentTerms}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[supplier.status]}`}>
                    {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-end space-x-2">
                    <button className="p-2 text-text-secondary hover:text-white hover:bg-gray-800 rounded-lg">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    {supplier.website && (
                      <a
                        href={supplier.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-text-secondary hover:text-white hover:bg-gray-800 rounded-lg"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
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
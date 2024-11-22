import React from 'react';
import { Package, TrendingUp } from 'lucide-react';

interface TopProductsProps {
  type: 'sales' | 'revenue';
}

interface Product {
  id: string;
  name: string;
  brand: string;
  metric: number;
  growth: number;
  image: string;
}

const mockProducts: Record<'sales' | 'revenue', Product[]> = {
  sales: [
    {
      id: '1',
      name: 'Bleu de Chanel',
      brand: 'Chanel',
      metric: 42,
      growth: 15,
      image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=100&h=100&q=80'
    },
    {
      id: '2',
      name: 'Black Orchid',
      brand: 'Tom Ford',
      metric: 38,
      growth: 8,
      image: 'https://images.unsplash.com/photo-1592914610354-fd354ea45e48?auto=format&fit=crop&w=100&h=100&q=80'
    },
    {
      id: '3',
      name: 'Aventus',
      brand: 'Creed',
      metric: 35,
      growth: 12,
      image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=100&h=100&q=80'
    }
  ],
  revenue: [
    {
      id: '1',
      name: 'Aventus',
      brand: 'Creed',
      metric: 1820000,
      growth: 18,
      image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=100&h=100&q=80'
    },
    {
      id: '2',
      name: 'Oud Wood',
      brand: 'Tom Ford',
      metric: 1260000,
      growth: 5,
      image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=100&h=100&q=80'
    },
    {
      id: '3',
      name: 'Bleu de Chanel',
      brand: 'Chanel',
      metric: 630000,
      growth: 10,
      image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=100&h=100&q=80'
    }
  ]
};

export default function TopProducts({ type }: TopProductsProps) {
  const title = type === 'sales' ? 'Top Selling Products' : 'Top Revenue Products';
  const icon = type === 'sales' ? Package : TrendingUp;
  const Icon = icon;
  const products = mockProducts[type];

  return (
    <div className="bg-card rounded-xl border border-gray-800 p-6">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <Icon className="w-5 h-5 text-primary" />
      </div>

      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={product.id} className="flex items-center gap-4">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                {index + 1}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-white">{product.name}</h4>
              <p className="text-sm text-text-secondary">{product.brand}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-white">
                {type === 'sales' 
                  ? `${product.metric} units`
                  : `KES ${product.metric.toLocaleString()}`
                }
              </p>
              <p className="text-sm text-success">+{product.growth}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: Error | null;
  fetchCustomers: () => Promise<void>;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  loading: false,
  error: null,

  fetchCustomers: async () => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // Get unique customers from orders with their metrics
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process orders to get unique customers with their metrics
      const customerMap = new Map<string, Customer>();

      data?.forEach(order => {
        const existingCustomer = customerMap.get(order.customer_phone);

        if (existingCustomer) {
          // Update existing customer metrics
          existingCustomer.totalOrders += 1;
          existingCustomer.totalSpent += Number(order.total_amount);
          if (new Date(order.created_at) > new Date(existingCustomer.lastOrder)) {
            existingCustomer.lastOrder = order.created_at;
          }
          // Update status based on recent activity (last 30 days)
          const daysSinceLastOrder = Math.floor(
            (Date.now() - new Date(existingCustomer.lastOrder).getTime()) / (1000 * 60 * 60 * 24)
          );
          existingCustomer.status = daysSinceLastOrder <= 30 ? 'active' : 'inactive';
        } else {
          // Add new customer
          customerMap.set(order.customer_phone, {
            id: order.customer_phone, // Using phone as unique identifier
            name: order.customer_name,
            phone: order.customer_phone,
            email: order.customer_email,
            totalOrders: 1,
            totalSpent: Number(order.total_amount),
            lastOrder: order.created_at,
            status: 'active',
            joinDate: order.created_at
          });
        }
      });

      set({ 
        customers: Array.from(customerMap.values()),
        loading: false 
      });
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      set({ 
        error: new Error(error.message),
        loading: false 
      });
    }
  }
}));
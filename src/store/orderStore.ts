import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { OrderStatus, PaymentStatus, PaymentMethod, DeliveryMode } from '../types/orders';

type Order = {
  id: string;
  created_at: string;
  updated_at: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  delivery_mode: DeliveryMode;
  delivery_notes?: string;
  total_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  mpesa_code?: string;
  user_id: string;
};

type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product_name: string;
};

interface OrderWithItems extends Order {
  items: OrderItem[];
}

interface OrderState {
  orders: OrderWithItems[];
  loading: boolean;
  error: Error | null;
  fetchOrders: () => Promise<void>;
  createOrder: (order: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'user_id'>, items: Omit<OrderItem, 'id' | 'order_id'>[]) => Promise<void>;
  updateOrder: (id: string, order: Partial<Order>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  verifyPayment: (id: string, mpesaCode: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      const ordersWithItems: OrderWithItems[] = [];

      for (const order of orders || []) {
        const { data: items, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id);

        if (itemsError) throw itemsError;

        ordersWithItems.push({
          ...order,
          items: items || []
        });
      }

      set({ orders: ordersWithItems, loading: false });
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      set({ error: new Error(error.message), loading: false });
    }
  },

  createOrder: async (orderData, items) => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // Start a transaction by inserting the order first
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{ ...orderData, user_id: user.id }])
        .select()
        .single();

      if (orderError) throw orderError;
      if (!order) throw new Error('Failed to create order');

      // Insert order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        product_name: item.product_name
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update product stock levels
      for (const item of items) {
        const { error: stockError } = await supabase.rpc('update_product_stock', {
          p_id: item.product_id,
          p_quantity: -item.quantity
        });

        if (stockError) throw stockError;
      }

      await get().fetchOrders();
    } catch (error: any) {
      console.error('Error creating order:', error);
      set({ error: new Error(error.message), loading: false });
      throw error;
    }
  },

  updateOrder: async (id, orderData) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('orders')
        .update(orderData)
        .eq('id', id);

      if (error) throw error;
      await get().fetchOrders();
    } catch (error: any) {
      console.error('Error updating order:', error);
      set({ error: new Error(error.message), loading: false });
      throw error;
    }
  },

  deleteOrder: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await get().fetchOrders();
    } catch (error: any) {
      console.error('Error deleting order:', error);
      set({ error: new Error(error.message), loading: false });
      throw error;
    }
  },

  verifyPayment: async (id, mpesaCode) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.rpc('verify_mpesa_payment', {
        p_order_id: id,
        p_mpesa_code: mpesaCode
      });

      if (error) throw error;
      await get().fetchOrders();
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      set({ error: new Error(error.message), loading: false });
      throw error;
    }
  }
}));
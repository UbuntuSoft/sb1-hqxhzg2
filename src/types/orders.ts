export type OrderStatus = 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'cancelled';
export type PaymentMethod = 'mpesa_stk' | 'mpesa_link' | 'mpesa_manual' | 'card' | 'cash';
export type DeliveryMode = 'boda' | 'pickup';

export interface OrderItem {
  id: string;
  product_id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  created_at: string;
  updated_at: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  items: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  mpesa_code?: string;
  delivery_address: string;
  delivery_mode: DeliveryMode;
  delivery_notes?: string;
  user_id: string;
}
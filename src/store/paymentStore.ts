import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { initiateSTKPush, generatePaymentLink } from '../lib/mpesa';

type Payment = {
  id: string;
  created_at: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  payment_method: 'mpesa_stk' | 'mpesa_link' | 'card';
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  reference: string;
  merchant_id: string;
  checkout_request_id?: string;
  mpesa_receipt?: string;
};

interface PaymentState {
  payments: Payment[];
  loading: boolean;
  error: Error | null;
  fetchPayments: () => Promise<void>;
  initiatePayment: (data: {
    amount: number;
    customerName: string;
    customerPhone?: string;
    customerEmail?: string;
    reference: string;
    paymentMethod: 'mpesa_stk' | 'mpesa_link' | 'card';
  }) => Promise<{ paymentUrl?: string; checkoutRequestId?: string }>;
  updatePaymentStatus: (id: string, status: Payment['status'], details?: any) => Promise<void>;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  payments: [],
  loading: false,
  error: null,

  fetchPayments: async () => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { data: payments, error } = await supabase
        .from('payments')
        .select('*')
        .eq('merchant_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ payments: payments || [] });
    } catch (error: any) {
      console.error('Error fetching payments:', error);
      set({ error: new Error(error.message) });
    } finally {
      set({ loading: false });
    }
  },

  initiatePayment: async ({ 
    amount, 
    customerName, 
    customerPhone, 
    customerEmail, 
    reference,
    paymentMethod 
  }) => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      // Create payment record
      const { data: payment, error: dbError } = await supabase
        .from('payments')
        .insert([{
          amount,
          status: 'pending',
          payment_method: paymentMethod,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail,
          reference,
          merchant_id: user.id
        }])
        .select()
        .single();

      if (dbError) throw dbError;
      if (!payment) throw new Error('Failed to create payment record');

      let paymentUrl: string | undefined;
      let checkoutRequestId: string | undefined;

      switch (paymentMethod) {
        case 'mpesa_stk':
          if (!customerPhone) throw new Error('Phone number required for STK push');
          const stkResponse = await initiateSTKPush({
            phoneNumber: customerPhone,
            amount,
            accountReference: reference,
            transactionDesc: `Payment for ${reference}`
          });
          checkoutRequestId = stkResponse.CheckoutRequestID;
          
          // Update payment record with checkout request ID
          await supabase
            .from('payments')
            .update({ checkout_request_id: checkoutRequestId })
            .eq('id', payment.id);
          break;

        case 'mpesa_link':
          const linkResponse = await generatePaymentLink({
            amount,
            accountReference: reference,
            transactionDesc: `Payment for ${reference}`
          });
          paymentUrl = linkResponse.paymentLink;
          break;

        case 'card':
          // Implement card payment initiation here
          break;
      }

      await get().fetchPayments();
      return { paymentUrl, checkoutRequestId };
    } catch (error: any) {
      console.error('Error initiating payment:', error);
      set({ error: new Error(error.message) });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updatePaymentStatus: async (id, status, details) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.rpc('update_payment_status', {
        p_payment_id: id,
        p_status: status,
        p_receipt: details?.mpesa_receipt
      });

      if (error) throw error;
      await get().fetchPayments();
    } catch (error: any) {
      console.error('Error updating payment status:', error);
      set({ error: new Error(error.message) });
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));
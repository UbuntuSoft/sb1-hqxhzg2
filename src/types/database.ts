export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string
          avatar_url: string | null
          business_name: string
          phone: string | null
          role: string
          subscription_tier: string
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name: string
          avatar_url?: string | null
          business_name: string
          phone?: string | null
          role?: string
          subscription_tier?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string
          avatar_url?: string | null
          business_name?: string
          phone?: string | null
          role?: string
          subscription_tier?: string
        }
      }
      payments: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          amount: number
          status: string
          payment_method: string
          customer_name: string
          customer_phone: string | null
          customer_email: string | null
          reference: string
          merchant_id: string
          checkout_request_id: string | null
          mpesa_receipt: string | null
          pesapal_merchant_reference: string | null
          pesapal_tracking_id: string | null
          order_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          amount: number
          status?: string
          payment_method: string
          customer_name: string
          customer_phone?: string | null
          customer_email?: string | null
          reference: string
          merchant_id: string
          checkout_request_id?: string | null
          mpesa_receipt?: string | null
          pesapal_merchant_reference?: string | null
          pesapal_tracking_id?: string | null
          order_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          amount?: number
          status?: string
          payment_method?: string
          customer_name?: string
          customer_phone?: string | null
          customer_email?: string | null
          reference?: string
          merchant_id?: string
          checkout_request_id?: string | null
          mpesa_receipt?: string | null
          pesapal_merchant_reference?: string | null
          pesapal_tracking_id?: string | null
          order_id?: string | null
        }
      }
      payment_links: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          payment_id: string
          url: string
          expires_at: string
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          payment_id: string
          url: string
          expires_at: string
          status?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          payment_id?: string
          url?: string
          expires_at?: string
          status?: string
        }
      }
      // ... rest of the existing tables ...
    }
    Functions: {
      update_payment_status: {
        Args: {
          p_payment_id: string
          p_status: string
          p_receipt?: string
        }
        Returns: void
      }
      // ... other functions ...
    }
  }
}
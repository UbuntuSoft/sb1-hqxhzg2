import { create } from 'zustand';
import { supabase } from '../lib/supabase';

type Product = {
  id: string;
  name: string;
  brand: string;
  sku: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  size: string;
  type: string;
  image_url?: string;
  user_id: string;
};

interface ProductState {
  products: Product[];
  loading: boolean;
  error: Error | null;
  fetchProducts: () => Promise<void>;
  createProduct: (product: Omit<Product, 'id' | 'user_id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateStock: (id: string, quantity: number) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ products: data || [], loading: false });
    } catch (error: any) {
      console.error('Error fetching products:', error);
      set({ error: new Error(error.message), loading: false });
    }
  },

  createProduct: async (product) => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('products')
        .insert([{ ...product, user_id: user.id }]);

      if (error) throw error;
      await get().fetchProducts();
    } catch (error: any) {
      console.error('Error creating product:', error);
      set({ error: new Error(error.message), loading: false });
      throw error;
    }
  },

  updateProduct: async (id, product) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id);

      if (error) throw error;
      await get().fetchProducts();
    } catch (error: any) {
      console.error('Error updating product:', error);
      set({ error: new Error(error.message), loading: false });
      throw error;
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await get().fetchProducts();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      set({ error: new Error(error.message), loading: false });
      throw error;
    }
  },

  updateStock: async (id, quantity) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.rpc('update_product_stock', {
        p_id: id,
        p_quantity: quantity
      });

      if (error) throw error;
      await get().fetchProducts();
    } catch (error: any) {
      console.error('Error updating stock:', error);
      set({ error: new Error(error.message), loading: false });
      throw error;
    }
  }
}));
import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type Supplier = Database['public']['Tables']['suppliers']['Row'];
type SupplierBrand = Database['public']['Tables']['supplier_brands']['Row'];
type NewSupplier = Database['public']['Tables']['suppliers']['Insert'];
type SupplierUpdate = Database['public']['Tables']['suppliers']['Update'];

interface SupplierWithBrands extends Supplier {
  brands: string[];
}

interface SupplierState {
  suppliers: SupplierWithBrands[];
  loading: boolean;
  error: Error | null;
  fetchSuppliers: () => Promise<void>;
  createSupplier: (supplier: Omit<NewSupplier, 'user_id'>, brands: string[]) => Promise<void>;
  updateSupplier: (id: string, supplier: SupplierUpdate, brands: string[]) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
}

export const useSupplierStore = create<SupplierState>((set, get) => ({
  suppliers: [],
  loading: false,
  error: null,

  fetchSuppliers: async () => {
    set({ loading: true, error: null });
    try {
      const { data: suppliers, error: suppliersError } = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false });

      if (suppliersError) throw suppliersError;

      const suppliersWithBrands: SupplierWithBrands[] = [];

      for (const supplier of suppliers || []) {
        const { data: brandData, error: brandsError } = await supabase
          .from('supplier_brands')
          .select('brand')
          .eq('supplier_id', supplier.id);

        if (brandsError) throw brandsError;

        suppliersWithBrands.push({
          ...supplier,
          brands: brandData?.map(b => b.brand) || []
        });
      }

      set({ suppliers: suppliersWithBrands });
    } catch (error: any) {
      set({ error });
    } finally {
      set({ loading: false });
    }
  },

  createSupplier: async (supplier, brands) => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { data: newSupplier, error: supplierError } = await supabase
        .from('suppliers')
        .insert([{ ...supplier, user_id: user.id }])
        .select()
        .single();

      if (supplierError) throw supplierError;
      if (!newSupplier) throw new Error('Failed to create supplier');

      if (brands.length > 0) {
        const brandRecords = brands.map(brand => ({
          supplier_id: newSupplier.id,
          brand
        }));

        const { error: brandsError } = await supabase
          .from('supplier_brands')
          .insert(brandRecords);

        if (brandsError) throw brandsError;
      }

      await get().fetchSuppliers();
    } catch (error: any) {
      set({ error });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateSupplier: async (id, supplier, brands) => {
    set({ loading: true, error: null });
    try {
      const { error: supplierError } = await supabase
        .from('suppliers')
        .update(supplier)
        .eq('id', id);

      if (supplierError) throw supplierError;

      // Delete existing brands
      const { error: deleteError } = await supabase
        .from('supplier_brands')
        .delete()
        .eq('supplier_id', id);

      if (deleteError) throw deleteError;

      // Insert new brands
      if (brands.length > 0) {
        const brandRecords = brands.map(brand => ({
          supplier_id: id,
          brand
        }));

        const { error: brandsError } = await supabase
          .from('supplier_brands')
          .insert(brandRecords);

        if (brandsError) throw brandsError;
      }

      await get().fetchSuppliers();
    } catch (error: any) {
      set({ error });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteSupplier: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await get().fetchSuppliers();
    } catch (error: any) {
      set({ error });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
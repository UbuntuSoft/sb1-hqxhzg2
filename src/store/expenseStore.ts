import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type Expense = Database['public']['Tables']['expenses']['Row'];
type NewExpense = Database['public']['Tables']['expenses']['Insert'];
type ExpenseUpdate = Database['public']['Tables']['expenses']['Update'];

interface ExpenseState {
  expenses: Expense[];
  loading: boolean;
  error: Error | null;
  fetchExpenses: () => Promise<void>;
  createExpense: (expense: Omit<NewExpense, 'id' | 'created_at'>) => Promise<void>;
  updateExpense: (id: string, expense: ExpenseUpdate) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  loading: false,
  error: null,

  fetchExpenses: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      set({ expenses: data || [] });
    } catch (error: any) {
      set({ error });
    } finally {
      set({ loading: false });
    }
  },

  createExpense: async (expense) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('expenses')
        .insert([expense]);

      if (error) throw error;
      await get().fetchExpenses();
    } catch (error: any) {
      set({ error });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateExpense: async (id, expense) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('expenses')
        .update(expense)
        .eq('id', id);

      if (error) throw error;
      await get().fetchExpenses();
    } catch (error: any) {
      set({ error });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteExpense: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await get().fetchExpenses();
    } catch (error: any) {
      set({ error });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
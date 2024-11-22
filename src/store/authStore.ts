import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, profile: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  error: null,

  loadUser: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        set({ user, profile });
      } else {
        set({ user: null, profile: null });
      }
    } catch (error: any) {
      set({ error });
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      set({ user: data.user, profile });
    } catch (error: any) {
      set({ error });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email: string, password: string, profile) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('User creation failed');

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ ...profile, id: data.user.id }]);

      if (profileError) throw profileError;

      set({ 
        user: data.user,
        profile: { ...profile, id: data.user.id, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      });
    } catch (error: any) {
      set({ error });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, profile: null });
    } catch (error: any) {
      set({ error });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (updates) => {
    const { user, profile } = get();
    if (!user || !profile) throw new Error('No user logged in');

    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;

      set({ profile: { ...profile, ...updates } });
    } catch (error: any) {
      set({ error });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
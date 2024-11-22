import React, { createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata: { 
    full_name: string;
    business_name: string;
    phone: string;
  }) => Promise<{ requiresEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const navigate = useNavigate();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
      } else {
        // Create profile if it doesn't exist
        const { data: userData } = await supabase.auth.getUser();
        const metadata = userData.user?.user_metadata;

        if (metadata) {
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert([{
              id: userId,
              full_name: metadata.full_name || '',
              business_name: metadata.business_name || '',
              phone: metadata.phone || null,
              role: 'owner',
              subscription_tier: 'free'
            }])
            .select()
            .single();

          if (insertError) throw insertError;
          setProfile(newProfile);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error as Error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session) {
          setSession(session);
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthError = (error: AuthError) => {
    let message = 'An error occurred during authentication';
    
    if (error.message.includes('Invalid login credentials')) {
      message = 'Invalid email or password';
    } else if (error.message.includes('Email not confirmed')) {
      message = 'Please confirm your email address before signing in';
    } else if (error.message.includes('Password should be at least 6 characters')) {
      message = 'Password must be at least 6 characters long';
    } else if (error.message.includes('User already registered')) {
      message = 'An account with this email already exists';
    }

    throw new Error(message);
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        handleAuthError(error);
      }

      if (!data.user) throw new Error('No user returned from sign in');

      await fetchProfile(data.user.id);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error signing in:', error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    metadata: {
      full_name: string;
      business_name: string;
      phone: string;
    }
  ) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (error) {
        handleAuthError(error);
      }

      if (!data.user) throw new Error('No user returned from sign up');

      const requiresEmailConfirmation = !data.session;
      
      if (!requiresEmailConfirmation) {
        await fetchProfile(data.user.id);
        navigate('/dashboard');
      }

      return { requiresEmailConfirmation };
    } catch (error: any) {
      console.error('Error signing up:', error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setSession(null);
      setUser(null);
      setProfile(null);
      navigate('/');
    } catch (error: any) {
      console.error('Error signing out:', error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    profile,
    signIn,
    signUp,
    signOut,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
import { supabase } from './supabase';

// User role type
export type UserRole = 'admin' | 'manager' | 'user' | 'viewer';

// User profile interface
export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Auth response interface
export interface AuthResponse {
  user: UserProfile | null;
  error: string | null;
  loading: boolean;
}

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message, loading: false };
    }

    if (data.user) {
      const profile = await getUserProfile(data.user.id);
      return { user: profile, error: null, loading: false };
    }

    return { user: null, error: 'Unknown error', loading: false };
  } catch (err) {
    return { user: null, error: err instanceof Error ? err.message : 'Unknown error', loading: false };
  }
}

// Sign up with email and password
export async function signUp(email: string, password: string, fullName: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      return { user: null, error: error.message, loading: false };
    }

    return { user: null, error: null, loading: false };
  } catch (err) {
    return { user: null, error: err instanceof Error ? err.message : 'Unknown error', loading: false };
  }
}

// Sign out
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

// Get user profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data as UserProfile;
  } catch (err) {
    console.error('Error fetching profile:', err);
    return null;
  }
}

// Get current user session
export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// Check if user has admin role
export async function isAdmin(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId);
  return profile?.role === 'admin';
}

// Update user profile
export async function updateProfile(userId: string, updates: Partial<UserProfile>): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// Subscribe to auth state changes
export function subscribeToAuthChanges(callback: (event: string, session: unknown) => void) {
  return supabase.auth.onAuthStateChange(callback);
}

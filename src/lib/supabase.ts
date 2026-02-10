import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// AGREGÁ ESTAS LÍNEAS TEMPORALMENTE:
console.log('Cargando Supabase URL:', SUPABASE_URL);
console.log('Cargando Supabase ANON_KEY:', SUPABASE_ANON_KEY ? '******' : 'UNDEFINED'); // Para no mostrar la key completa

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
export { createClient }

// User profile type
export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'manager' | 'user' | 'viewer';
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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

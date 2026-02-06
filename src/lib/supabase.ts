import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// AGREGÁ ESTAS LÍNEAS TEMPORALMENTE:
console.log('Cargando Supabase URL:', SUPABASE_URL);
console.log('Cargando Supabase ANON_KEY:', SUPABASE_ANON_KEY ? '******' : 'UNDEFINED'); // Para no mostrar la key completa

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
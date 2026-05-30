import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  // eslint-disable-next-line no-console
  console.warn('Missing Supabase env vars: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY')
}

// Only initialize if we have BOTH values to avoid crashing the app.
export const supabase = (url && anonKey) 
  ? createClient(url, anonKey) 
  : { 
      auth: { getSession: async () => ({ data: { session: null }, error: null }) },
      from: () => ({ select: () => ({ order: () => ({ match: () => ({}) }) }) }) // minimal mock
    }


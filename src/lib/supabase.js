import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validation more strict for production/Vercel
const isReady = url && anonKey && url !== 'undefined' && anonKey !== 'undefined'

if (!isReady) {
  // eslint-disable-next-line no-console
  console.warn('Supabase env vars are missing or invalid. Check Vercel project settings.')
}

export const supabase = isReady 
  ? createClient(url, anonKey) 
  : { 
      auth: { 
        getSession: async () => ({ data: { session: null }, error: null }),
        signInWithPassword: async () => ({ 
          data: { user: null, session: null }, 
          error: { message: 'Configuration Supabase manquante sur le serveur de production.' } 
        })
      },
      from: () => ({ 
        select: () => ({ 
          order: () => ({ 
            match: () => ({ 
              then: (cb) => cb({ data: [], error: { message: 'Supabase non configuré' } }) 
            }),
            then: (cb) => cb({ data: [], error: { message: 'Supabase non configuré' } })
          }),
          then: (cb) => cb({ data: [], error: { message: 'Supabase non configuré' } })
        }) 
      })
    }


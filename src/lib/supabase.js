import { createClient } from '@supabase/supabase-js'

const url = (import.meta.env.VITE_SUPABASE_URL || '').trim()
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '').trim()

// Validation more strict for production/Vercel
const isUrlValid = url.startsWith('https://')
const isReady = url && anonKey && url !== 'undefined' && anonKey !== 'undefined' && isUrlValid

if (!isReady) {
  // eslint-disable-next-line no-console
  console.warn('Supabase configuration incomplete or invalid URL:', { url: url.substring(0, 10) + '...', isUrlValid })
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


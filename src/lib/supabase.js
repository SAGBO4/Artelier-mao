import { createClient } from '@supabase/supabase-js'

const url = (import.meta.env.VITE_SUPABASE_URL || '').trim()
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

const isReady = url.startsWith('https://') && anonKey.startsWith('eyJ')

if (!isReady) {
  // eslint-disable-next-line no-console
  console.warn('[Supabase] Missing or invalid env vars. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
}

export const supabase = isReady
  ? createClient(url, anonKey)
  : {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        signInWithPassword: async () => ({
          data: { user: null, session: null },
          error: { message: 'Configuration Supabase manquante. Contactez l\'administrateur.' }
        })
      },
      from: () => ({
        select: () => ({
          order: () => ({
            then: (cb) => cb({ data: [], error: null })
          }),
          then: (cb) => cb({ data: [], error: null })
        })
      })
    }

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

if (!supabaseUrl || !supabaseAnonKey) {
  // Log a clear warning during local/dev builds so maintainers know to set env vars
  // (We avoid throwing so builds don't always fail in CI without secrets.)
  // In production you should ensure env vars are set and not checked into source control.
  // eslint-disable-next-line no-console
  console.warn('Supabase env variables VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY are not set.')
}

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

export function createClient() {
  return supabase
}

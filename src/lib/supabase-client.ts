import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  // Fail fast with clear guidance for developers
  const missing = [!url && 'VITE_SUPABASE_URL', !anonKey && 'VITE_SUPABASE_ANON_KEY'].filter(Boolean).join(', ')
  // eslint-disable-next-line no-console
  console.error(`[supabase] Missing environment variables: ${missing}.\n` +
    'Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.\n' +
    'Example:\n' +
    'VITE_SUPABASE_URL="https://xyzcompany.supabase.co"\n' +
    'VITE_SUPABASE_ANON_KEY="your-anon-key"')
}

export const supabase = createClient(url as string, anonKey as string)
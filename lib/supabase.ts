import { createClient, SupabaseClient } from '@supabase/supabase-js';

export type UserRole = 'farmer' | 'agriculture_officer';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  village?: string;
  district?: string;
  state?: string;
  is_verified?: boolean;
  account_status?: string;
  officer_details?: {
    officer_id?: string;
    department?: string;
    designation?: string;
    is_verified?: boolean;
  };
  created_at?: string;
  updated_at?: string;
}

// Read environment variables
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  '';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  '';

export const getSupabaseConfig = () => {
  const isConfigured =
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseUrl.includes('placeholder') &&
    supabaseUrl.startsWith('https://');

  return {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
    isConfigured,
  };
};

export const isSupabaseConfigured = (): boolean => {
  return getSupabaseConfig().isConfigured;
};

// Diagnostic logging
if (typeof window !== 'undefined') {
  const config = getSupabaseConfig();
  if (!config.isConfigured) {
    console.error(
      '⚠️ [Supabase] Missing or invalid configuration!\n' +
      'Please check your .env.local file and ensure the following keys are present:\n' +
      '  NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co\n' +
      '  NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>\n' +
      `Current URL: "${supabaseUrl || 'EMPTY'}"\n` +
      `Current Key: "${supabaseAnonKey ? supabaseAnonKey.slice(0, 10) + '...' : 'EMPTY'}"`
    );
  } else {
    console.log('✅ [Supabase] Client initialized successfully for URL:', supabaseUrl);
  }
}

// Create real Supabase client
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

import { supabase, isSupabaseConfigured, getSupabaseConfig, UserProfile, UserRole } from './supabase';

export interface AuthResponse {
  user: { id: string; email?: string } | null;
  profile: UserProfile | null;
  role: UserRole;
  requiresEmailConfirmation?: boolean;
}

export const authService = {
  /**
   * 1. Real Supabase Login with Email & Password
   * Role is fetched directly from the database `profiles` table.
   */
  async loginWithEmailPassword(
    email: string,
    password: string
  ): Promise<AuthResponse> {
    const config = getSupabaseConfig();
    if (!config.isConfigured) {
      throw new Error(
        'Supabase is not configured! Please provide NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Real network call to Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      console.error('[Supabase Auth Error - signInWithPassword]:', error);
      throw new Error(formatAuthError(error.message));
    }

    if (!data.user) {
      throw new Error('Authentication succeeded but no user record was returned by Supabase.');
    }

    // 2. Fetch role from Supabase 'profiles' table
    let resolvedRole: UserRole = (data.user.user_metadata?.role as UserRole) || 'farmer';
    let userProfile: UserProfile | null = null;

    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profileErr) {
      console.error('[Supabase DB Error - fetching profiles]:', profileErr);
      if (profileErr.code === '42P01' || profileErr.message?.includes('does not exist')) {
        throw new Error(
          'The `profiles` table does not exist in your Supabase database. Please execute the SQL in `supabase-schema.sql` in your Supabase SQL Editor.'
        );
      }
    }

    if (profile) {
      resolvedRole = profile.role as UserRole;
      userProfile = profile as UserProfile;
    } else {
      // If user exists in auth.users but has no profile row yet, insert one now
      const newProfile: UserProfile = {
        id: data.user.id,
        email: cleanEmail,
        full_name:
          data.user.user_metadata?.full_name ||
          data.user.email?.split('@')[0] ||
          'Agriculture User',
        role: resolvedRole,
        created_at: new Date().toISOString(),
      };

      const { error: insertErr } = await supabase
        .from('profiles')
        .upsert(newProfile, { onConflict: 'id' });

      if (insertErr) {
        console.error('[Supabase DB Error - inserting profile fallback]:', insertErr);
      }
      userProfile = newProfile;
    }

    return {
      user: data.user,
      profile: userProfile,
      role: resolvedRole,
    };
  },

  /**
   * 2. Real Supabase Sign Up with Email, Password, Full Name, and Selected Role
   * Inserts the user into Supabase Auth and saves a real record in the `profiles` table.
   */
  async signUpWithEmailPassword(params: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
  }): Promise<AuthResponse> {
    const config = getSupabaseConfig();
    if (!config.isConfigured) {
      throw new Error(
        'Supabase is not configured! Please provide NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
      );
    }

    const { email, password, fullName, role } = params;
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    // 1. Real network call to Supabase Auth signUp
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: cleanName,
          role: role,
        },
      },
    });

    if (error) {
      console.error('[Supabase Auth Error - signUp]:', error);
      throw new Error(formatAuthError(error.message));
    }

    if (!data.user) {
      throw new Error('Supabase account creation failed: no user returned.');
    }

    // 2. Real insertion into the 'profiles' table in Supabase
    const profileRecord: UserProfile = {
      id: data.user.id,
      email: cleanEmail,
      full_name: cleanName,
      role: role,
      created_at: new Date().toISOString(),
    };

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(profileRecord, { onConflict: 'id' });

    if (profileError) {
      console.error('[Supabase DB Error - profiles upsert]:', profileError);
      if (profileError.code === '42P01' || profileError.message?.includes('does not exist')) {
        throw new Error(
          'Account created in Supabase Auth, but the `profiles` table does not exist in your database yet! Please run the SQL schema in `supabase-schema.sql` in your Supabase SQL Editor.'
        );
      }
      throw new Error(`Profile creation error: ${profileError.message}`);
    }

    // Check if Supabase project requires email confirmation
    const requiresConfirmation = !data.session;

    return {
      user: data.user,
      profile: profileRecord,
      role: role,
      requiresEmailConfirmation: requiresConfirmation,
    };
  },

  /**
   * 3. Fetch currently logged in session and real profile from Supabase
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    if (!isSupabaseConfigured()) {
      return null;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return null;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();

    if (profile && !error) {
      return profile as UserProfile;
    }

    return {
      id: session.user.id,
      email: session.user.email || '',
      full_name:
        session.user.user_metadata?.full_name ||
        session.user.email?.split('@')[0] ||
        'User',
      role: (session.user.user_metadata?.role as UserRole) || 'farmer',
    };
  },

  /**
   * 4. Real Sign Out from Supabase
   */
  async signOut(): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
  },

  // ============================================================================
  // FUTURE SOCIAL OAUTH INTEGRATION (Google, Facebook, Apple)
  // When ready to add social login:
  // 1. Enable Google / Facebook in your Supabase Dashboard -> Authentication -> Providers
  // 2. Uncomment and call signInWithOAuth(provider, role)
  // ============================================================================
  /*
  async signInWithOAuth(provider: 'google' | 'facebook' | 'apple', role: UserRole) {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase configuration is required for Social OAuth.');
    }
    return await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?role=${role}`,
      },
    });
  }
  */
};

function formatAuthError(errorMsg: string): string {
  const msg = errorMsg.toLowerCase();

  if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
    return 'The email address or password you entered is incorrect.';
  }
  if (msg.includes('user already registered') || msg.includes('already exists')) {
    return 'An account with this email address already exists. Please log in instead.';
  }
  if (msg.includes('password should be at least') || msg.includes('weak password')) {
    return 'Password is too weak. Please use at least 6 characters.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Please confirm your email address via the link sent to your email inbox.';
  }
  if (msg.includes('rate limit') || msg.includes('too many requests')) {
    return 'Too many login attempts. Please wait a moment and try again.';
  }
  if (msg.includes('network') || msg.includes('failed to fetch')) {
    return 'Could not connect to Supabase. Please verify your internet connection and SUPABASE_URL.';
  }

  return errorMsg;
}

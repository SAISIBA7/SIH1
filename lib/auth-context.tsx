'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { isSupabaseConfigured, UserProfile, UserRole } from './supabase';
import { authService, AuthResponse } from './auth-service';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  isLoading: boolean;
  isConfigured: boolean;
  loginWithEmailPassword: (email: string, pass: string) => Promise<AuthResponse>;
  signUpWithEmailPassword: (params: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
  }) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>('farmer');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isConfigured = isSupabaseConfigured();

  const refreshUser = async () => {
    try {
      const current = await authService.getCurrentUser();
      if (current) {
        setUser(current);
        setRole(current.role);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Session refresh failed:', err);
      setUser(null);
    }
  };

  // Restore session on initial load
  useEffect(() => {
    async function loadUser() {
      try {
        await refreshUser();
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  const loginWithEmailPassword = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await authService.loginWithEmailPassword(email, pass);
      if (res.profile) {
        setUser(res.profile);
        setRole(res.role);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithEmailPassword = async (params: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
  }) => {
    setIsLoading(true);
    try {
      const res = await authService.signUpWithEmailPassword(params);
      if (res.profile) {
        setUser(res.profile);
        setRole(res.role);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        setRole,
        isLoading,
        isConfigured,
        loginWithEmailPassword,
        signUpWithEmailPassword,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

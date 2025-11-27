'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserId, LoginResponse } from '@/lib/types';

interface AuthContextType {
  userId: UserId | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<UserId | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedToken = localStorage.getItem('auth_token');
    const storedUserId = localStorage.getItem('user_id') as UserId | null;

    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUserId(storedUserId);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data: LoginResponse = await response.json();

      if (data.success && data.userId && data.token) {
        setUserId(data.userId);
        setToken(data.token);
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_id', data.userId);
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Error de conexión' };
    }
  };

  const logout = () => {
    setUserId(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
  };

  return (
    <AuthContext.Provider value={{ userId, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


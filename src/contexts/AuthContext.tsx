import { useState, useCallback, type ReactNode } from 'react';
import type { User, AuthContextType } from '../types';
import { mockUsers } from '../data/mockData';
import { AuthContext } from './authContextDef';

// Simple password storage (in production, use proper hashing and backend auth)
const userPasswords: Record<string, string> = {
  admin: 'admin',
  mario: 'mario123',
  luigi: 'luigi123',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    // Simple mock authentication
    const foundUser = mockUsers.find((u) => u.username === username);
    if (foundUser && userPasswords[username] === password) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: user !== null,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { mockUsers, getDataForUser } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchUser: (userId: string) => void;
  isLoading: boolean;
  userData: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  // Mock authentication - in a real app, this would validate against a backend
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find user by email in mock data
    const foundUser = mockUsers.find(u => u.email === email);

    if (foundUser) {
      setUser(foundUser);
      const data = getDataForUser(foundUser.id, foundUser.role);
      setUserData(data);

      // Store in localStorage for persistence
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      localStorage.setItem('userData', JSON.stringify(data));

      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    setUserData(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userData');
  };

  // For demo purposes - allow switching between user types
  const switchUser = (userId: string) => {
    const foundUser = mockUsers.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
      const data = getDataForUser(foundUser.id, foundUser.role);
      setUserData(data);

      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      localStorage.setItem('userData', JSON.stringify(data));
    }
  };

  // Check for existing session on app load
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const savedUser = localStorage.getItem('currentUser');
        const savedUserData = localStorage.getItem('userData');

        if (savedUser && savedUserData) {
          setUser(JSON.parse(savedUser));
          setUserData(JSON.parse(savedUserData));
        }
      } catch (error) {
        console.error('Error loading saved session:', error);
        // Clear corrupted data
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userData');
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  const value: AuthContextType = {
    user,
    login,
    logout,
    switchUser,
    isLoading,
    userData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
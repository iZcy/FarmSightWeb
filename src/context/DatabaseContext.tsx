import React, { createContext, useContext, useEffect, useState } from 'react';
import { initDatabase } from '../services/database';
import { verifySession, login as authLogin, logout as authLogout, register as authRegister } from '../services/auth';
import { migrateMockData, isDatabaseInitialized } from '../services/migration';
import type { User } from '../types';

interface DatabaseContextType {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
  sessionId: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const DatabaseContext = createContext<DatabaseContextType | null>(null);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Initialize database
        await initDatabase();

        // Check if database has data
        if (!isDatabaseInitialized()) {
          // Migrate mock data
          const result = migrateMockData();
          if (!result.success) {
            console.error('Failed to migrate data:', result.error);
          }
        }

        // Check for existing session
        const savedSessionId = localStorage.getItem('farmsight-session');
        if (savedSessionId) {
          const { valid, user: sessionUser } = verifySession(savedSessionId);
          if (valid && sessionUser) {
            setUser(sessionUser);
            setSessionId(savedSessionId);
            setIsAuthenticated(true);
          } else {
            // Session expired or invalid
            localStorage.removeItem('farmsight-session');
          }
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Database initialization error:', error);
        setIsInitialized(true); // Still mark as initialized to show UI
      }
    };

    init();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const result = authLogin(email, password);
    if (result.success && result.user && result.sessionId) {
      setUser(result.user);
      setSessionId(result.sessionId);
      setIsAuthenticated(true);
      localStorage.setItem('farmsight-session', result.sessionId);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const result = authRegister(name, email, password, phone);
    if (result.success && result.user) {
      // Auto-login after registration
      const loginResult = await login(email, password);
      return loginResult;
    }
    return { success: false, error: result.error };
  };

  const logout = () => {
    if (sessionId) {
      authLogout(sessionId);
      localStorage.removeItem('farmsight-session');
    }
    setUser(null);
    setSessionId(null);
    setIsAuthenticated(false);
  };

  return (
    <DatabaseContext.Provider
      value={{
        isInitialized,
        isAuthenticated,
        user,
        sessionId,
        login,
        register,
        logout,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within DatabaseProvider');
  }
  return context;
};

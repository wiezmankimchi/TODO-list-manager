import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = '@auth_session';

interface AuthContextType {
  session: string | null;
  isLoading: boolean;
  signIn: (username: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be wrapped in an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    AsyncStorage.getItem(SESSION_KEY).then((saved) => {
      if (saved) setSession(saved);
      setIsLoading(false);
      setIsMounted(true);
    });
  }, []);

  useEffect(() => {
    if (!isMounted || isLoading) return;

    const inAppGroup = segments[0] === '(main)';

    if (!session && inAppGroup) {
      router.replace('/login');
    } else if (session && !inAppGroup) {
      router.replace('/');
    }
  }, [session, segments, isMounted, isLoading]);

  const signIn = (username: string) => {
    setSession(username);
    AsyncStorage.setItem(SESSION_KEY, username);
  };

  const signOut = () => {
    setSession(null);
    AsyncStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ session, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

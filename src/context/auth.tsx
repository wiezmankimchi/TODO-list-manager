import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';

interface AuthContextType {
  session: string | null;
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
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Check if the current route segment is within the protected (main) group
    const inAppGroup = segments[0] === '(main)';

    if (!session && inAppGroup) {
      // Redirect to login if not authenticated
      router.replace('/login');
    } else if (session && !inAppGroup) {
      // Redirect to index page within (app) if authenticated and on a public page (like login)
      router.replace('/');
    }
  }, [session, segments, isMounted]);

  const signIn = (username: string) => {
    setSession(username);
  };

  const signOut = () => {
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

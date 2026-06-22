import React from 'react';
import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@/context/auth';
import { useTheme } from '@/hooks/use-theme';

export default function AppLayout() {
  const { session } = useAuth();
  const theme = useTheme();

  // If there is no authenticated session, redirect to the login screen
  if (!session) {
    return <Redirect href="/login" />;
  }

  // Define stack navigator with styled headers matching our grayscale theme
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerShadowVisible: false,
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Dashboard',
          headerShown: false, // We will build a custom header on the dashboard
        }}
      />
      <Stack.Screen
        name="lists"
        options={{
          title: 'Lists',
          headerBackTitle: '',
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'Profile & Settings',
          headerBackTitle: '',
        }}
      />
    </Stack>
  );
}

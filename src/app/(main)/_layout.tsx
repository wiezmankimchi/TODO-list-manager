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
          title: 'Home',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="scan"
        options={{
          title: 'Scan QR Code',
          headerBackTitle: 'Home',
        }}
      />
      <Stack.Screen
        name="capture"
        options={{
          title: 'Capture Images',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="process"
        options={{
          title: 'Review & Generate PDF',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="upload"
        options={{
          title: 'Upload to OpenDental',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'Profile & Settings',
          headerBackTitle: 'Home',
        }}
      />
    </Stack>
  );
}

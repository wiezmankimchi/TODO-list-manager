import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { View, Text, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider, useAuth } from '../auth';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  useSegments: () => [],
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

function TestConsumer() {
  const { session, signIn, signOut } = useAuth();
  return (
    <View>
      <Text testID="session">{session ?? 'null'}</Text>
      <Pressable testID="sign-in" onPress={() => signIn('demo@example.com')} />
      <Pressable testID="sign-out" onPress={() => signOut()} />
    </View>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
});

async function renderWithProvider() {
  await act(async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
  });
}

describe('AuthProvider', () => {
  it('starts with null session', async () => {
    await renderWithProvider();
    expect(screen.getByTestId('session').props.children).toBe('null');
  });

  it('signIn sets session and writes to AsyncStorage', async () => {
    await renderWithProvider();

    await act(async () => {
      fireEvent.press(screen.getByTestId('sign-in'));
    });

    expect(screen.getByTestId('session').props.children).toBe('demo@example.com');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@auth_session', 'demo@example.com');
  });

  it('signOut clears session and removes from AsyncStorage', async () => {
    await renderWithProvider();

    await act(async () => {
      fireEvent.press(screen.getByTestId('sign-in'));
    });
    expect(screen.getByTestId('session').props.children).toBe('demo@example.com');

    await act(async () => {
      fireEvent.press(screen.getByTestId('sign-out'));
    });
    expect(screen.getByTestId('session').props.children).toBe('null');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@auth_session');
  });

  it('restores session from AsyncStorage on mount', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('saved@user.com');

    await act(async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@auth_session');
    expect(screen.getByTestId('session').props.children).toBe('saved@user.com');
  });
});

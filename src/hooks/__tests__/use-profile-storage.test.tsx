import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { View, Text, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProfileStorage } from '../use-profile-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

function TestConsumer({ sessionEmail }: { sessionEmail: string | null }) {
  const { profile, isLoaded, saveProfile, clearProfile } = useProfileStorage(sessionEmail);
  return (
    <View>
      <Text testID="displayName">{profile.displayName}</Text>
      <Text testID="email">{profile.email}</Text>
      <Text testID="notifications">{String(profile.notifications)}</Text>
      <Text testID="isLoaded">{String(isLoaded)}</Text>
      <Pressable
        testID="save"
        onPress={() => saveProfile({ displayName: 'Updated', email: 'new@email.com', notifications: false })}
      />
      <Pressable testID="clear" onPress={() => clearProfile()} />
    </View>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
});

describe('useProfileStorage', () => {
  it('returns fallback profile derived from session email', async () => {
    await act(async () => {
      render(<TestConsumer sessionEmail="demo@example.com" />);
    });
    expect(screen.getByTestId('displayName').props.children).toBe('demo');
    expect(screen.getByTestId('email').props.children).toBe('demo@example.com');
    expect(screen.getByTestId('notifications').props.children).toBe('true');
  });

  it('returns generic fallback when session is null', async () => {
    await act(async () => {
      render(<TestConsumer sessionEmail={null} />);
    });
    expect(screen.getByTestId('displayName').props.children).toBe('Admin');
    expect(screen.getByTestId('email').props.children).toBe('admin@example.com');
  });

  it('loads stored profile from AsyncStorage on mount', async () => {
    const stored = JSON.stringify({
      displayName: 'Jane',
      email: 'jane@test.com',
      notifications: false,
    });
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(stored);

    await act(async () => {
      render(<TestConsumer sessionEmail="x@x.com" />);
    });

    expect(screen.getByTestId('displayName').props.children).toBe('Jane');
    expect(screen.getByTestId('email').props.children).toBe('jane@test.com');
    expect(screen.getByTestId('notifications').props.children).toBe('false');
    expect(screen.getByTestId('isLoaded').props.children).toBe('true');
  });

  it('saveProfile updates state and writes to AsyncStorage', async () => {
    await act(async () => {
      render(<TestConsumer sessionEmail="a@b.com" />);
    });

    await act(async () => {
      fireEvent.press(screen.getByTestId('save'));
    });

    expect(screen.getByTestId('displayName').props.children).toBe('Updated');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@profile_data',
      JSON.stringify({ displayName: 'Updated', email: 'new@email.com', notifications: false })
    );
  });

  it('clearProfile removes from AsyncStorage', async () => {
    await act(async () => {
      render(<TestConsumer sessionEmail="a@b.com" />);
    });

    await act(async () => {
      fireEvent.press(screen.getByTestId('clear'));
    });

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@profile_data');
  });
});

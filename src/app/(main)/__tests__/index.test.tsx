import React from 'react';
import { render, screen, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskProvider } from '../../../context/tasks';
import DashboardScreen from '../index';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  useSegments: () => ['(main)'],
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../../context/auth', () => ({
  useAuth: () => ({
    session: 'demo@example.com',
    isLoading: false,
    signIn: jest.fn(),
    signOut: jest.fn(),
  }),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return { SafeAreaView: View };
});

jest.mock('lucide-react-native', () => {
  const { View } = require('react-native');
  return new Proxy({}, { get: () => View });
});

beforeEach(() => {
  jest.clearAllMocks();
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
});

async function renderDashboard() {
  await act(async () => {
    render(
      <TaskProvider>
        <DashboardScreen />
      </TaskProvider>
    );
  });
}

describe('DashboardScreen', () => {
  it('greets with display name derived from session', async () => {
    await renderDashboard();
    expect(screen.getByText('demo')).toBeTruthy();
    expect(screen.getByText('Welcome back,')).toBeTruthy();
  });

  it('shows active task count from context', async () => {
    await renderDashboard();
    expect(screen.getByText('Active Tasks')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('shows completed task count from context', async () => {
    await renderDashboard();
    expect(screen.getByText('Tasks Done')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
  });

  it('shows growth label', async () => {
    await renderDashboard();
    expect(screen.getByText('Growth')).toBeTruthy();
  });

  it('renders navigation links', async () => {
    await renderDashboard();
    expect(screen.getByText('My Lists')).toBeTruthy();
    expect(screen.getByText('Profile & Settings')).toBeTruthy();
  });

  it('renders recent activity section', async () => {
    await renderDashboard();
    expect(screen.getByText('Recent Logs')).toBeTruthy();
  });
});

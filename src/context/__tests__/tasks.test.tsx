import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react-native';
import { View, Text, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskProvider, useTasks } from '../tasks';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

function TestConsumer() {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();
  return (
    <View>
      <Text testID="count">{tasks.length}</Text>
      {tasks.map((t) => (
        <View key={t.id} testID={`task-${t.id}`}>
          <Text testID={`title-${t.id}`}>{t.title}</Text>
          <Text testID={`completed-${t.id}`}>{String(t.completed)}</Text>
          <Text testID={`priority-${t.id}`}>{t.priority}</Text>
        </View>
      ))}
      <Pressable testID="add" onPress={() => addTask('New task')} />
      <Pressable testID="add-high" onPress={() => addTask('High pri', 'high')} />
      <Pressable testID="toggle-1" onPress={() => toggleTask('1')} />
      <Pressable testID="delete-1" onPress={() => deleteTask('1')} />
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
      <TaskProvider>
        <TestConsumer />
      </TaskProvider>
    );
  });
}

describe('TaskProvider', () => {
  it('provides default mock tasks', async () => {
    await renderWithProvider();
    expect(screen.getByTestId('count').props.children).toBe(5);
  });

  it('addTask adds a task with correct fields', async () => {
    await renderWithProvider();

    await act(async () => {
      fireEvent.press(screen.getByTestId('add'));
    });

    expect(screen.getByTestId('count').props.children).toBe(6);
  });

  it('addTask accepts custom priority', async () => {
    await renderWithProvider();

    await act(async () => {
      fireEvent.press(screen.getByTestId('add-high'));
    });

    expect(screen.getByTestId('count').props.children).toBe(6);
    const priorities = screen.getAllByTestId(/^priority-/);
    expect(priorities[0].props.children).toBe('high');
  });

  it('toggleTask flips completed status', async () => {
    await renderWithProvider();
    const before = screen.getByTestId('completed-1').props.children;

    await act(async () => {
      fireEvent.press(screen.getByTestId('toggle-1'));
    });

    expect(screen.getByTestId('completed-1').props.children).not.toBe(before);
  });

  it('deleteTask removes the task', async () => {
    await renderWithProvider();

    await act(async () => {
      fireEvent.press(screen.getByTestId('delete-1'));
    });

    expect(screen.getByTestId('count').props.children).toBe(4);
    expect(screen.queryByTestId('task-1')).toBeNull();
  });

  it('loads tasks from AsyncStorage on mount', async () => {
    const stored = JSON.stringify([
      { id: '99', title: 'Stored task', completed: false, priority: 'low', createdAt: 1000 },
    ]);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(stored);

    await act(async () => {
      render(
        <TaskProvider>
          <TestConsumer />
        </TaskProvider>
      );
    });

    expect(screen.getByTestId('title-99').props.children).toBe('Stored task');
    expect(screen.getByTestId('count').props.children).toBe(1);
  });
});

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '@/types/task';

const TASKS_STORAGE_KEY = '@tasks_data';

const now = Date.now();
const DAY = 86_400_000;

const DEFAULT_TASKS: Task[] = [
  { id: '1', title: 'Design premium login screen mockup', completed: true, priority: 'high', createdAt: now - 10 * DAY },
  { id: '2', title: 'Install lucide icons pack', completed: true, priority: 'medium', createdAt: now - 9 * DAY },
  { id: '3', title: 'Implement AuthContext and routing guards', completed: false, priority: 'high', createdAt: now - 8 * DAY },
  { id: '4', title: 'Review Expo Router native tabs performance', completed: false, priority: 'low', createdAt: now - 2 * DAY },
  { id: '5', title: 'Polish grayscale UI transitions', completed: false, priority: 'medium', createdAt: now - 1 * DAY },
];

interface TaskContextType {
  tasks: Task[];
  isLoaded: boolean;
  addTask: (title: string, priority?: Task['priority']) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | null>(null);

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be wrapped in a TaskProvider');
  }
  return context;
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(TASKS_STORAGE_KEY).then((raw) => {
      if (raw) {
        setTasks(JSON.parse(raw));
      }
      hasLoadedRef.current = true;
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!hasLoadedRef.current) return;
    AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((title: string, priority: Task['priority'] = 'medium') => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      priority,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, isLoaded, addTask, toggleTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
}

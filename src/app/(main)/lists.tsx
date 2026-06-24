import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Pressable,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { useTasks } from '@/context/tasks';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ThemedText } from '@/components/themed-text';
import { Circle, CheckCircle, Trash2, Plus, Filter } from 'lucide-react-native';

export default function ListsScreen() {
  const theme = useTheme();
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState<'all' | 'todo' | 'completed'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle.trim());
    setNewTaskTitle('');
  };

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'todo') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme.text;
      case 'medium':
        return theme.textSecondary;
      case 'low':
        return theme.border;
      default:
        return theme.textSecondary;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header filter controls */}
      <View style={[styles.filterBar, { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
        <View style={styles.filterPills}>
          {(['all', 'todo', 'completed'] as const).map((type) => (
            <Pressable
              key={type}
              onPress={() => setFilter(type)}
              style={[
                styles.filterPill,
                filter === type && {
                  backgroundColor: theme.primary,
                  borderColor: theme.primary,
                },
                filter !== type && {
                  borderColor: theme.border,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.filterText,
                  {
                    color: filter === type ? theme.primaryForeground : theme.textSecondary,
                  },
                ]}
              >
                {type === 'all' ? 'All' : type === 'todo' ? 'To Do' : 'Done'}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.text}
            colors={[theme.text]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Filter size={36} color={theme.border} />
            <ThemedText style={{ color: theme.textSecondary, marginTop: 12 }}>
              No tasks found
            </ThemedText>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={[styles.taskCard, item.completed && { opacity: 0.6 }]}>
            <CardContent style={styles.taskContent}>
              <Pressable onPress={() => toggleTask(item.id)} style={styles.checkArea}>
                {item.completed ? (
                  <CheckCircle size={22} color={theme.text} />
                ) : (
                  <Circle size={22} color={theme.border} />
                )}
              </Pressable>
              
              <View style={styles.titleArea}>
                <ThemedText
                  style={[
                    styles.taskTitle,
                    { color: theme.text },
                    item.completed && {
                      textDecorationLine: 'line-through',
                      color: theme.textSecondary,
                    },
                  ]}
                >
                  {item.title}
                </ThemedText>
                
                {/* Priority Badge */}
                <View style={styles.priorityRow}>
                  <View
                    style={[
                      styles.priorityDot,
                      { backgroundColor: getPriorityColor(item.priority) },
                    ]}
                  />
                  <ThemedText type="code" style={{ fontSize: 10, color: theme.textSecondary }}>
                    {item.priority} priority
                  </ThemedText>
                </View>
              </View>

              <Pressable
                onPress={() => deleteTask(item.id)}
                style={({ pressed }) => [
                  styles.deleteButton,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Trash2 size={18} color={theme.destructive} />
              </Pressable>
            </CardContent>
          </Card>
        )}
      />

      {/* Input bar to add task */}
      <View
        style={[
          styles.inputBar,
          {
            borderTopWidth: 1,
            borderTopColor: theme.border,
            backgroundColor: theme.background,
          },
        ]}
      >
        <Input
          placeholder="Add a new task..."
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
          containerStyle={styles.textInputContainer}
          onSubmitEditing={handleAddTask}
          returnKeyType="done"
        />
        <Button
          variant="default"
          onPress={handleAddTask}
          style={styles.addButton}
          leftIcon={<Plus size={18} color={theme.primaryForeground} />}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterPills: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  taskCard: {
    padding: 12,
    marginVertical: 4,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkArea: {
    padding: 4,
    marginRight: 10,
  },
  titleArea: {
    flex: 1,
    gap: 4,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  textInputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  addButton: {
    height: 44,
    width: 44,
    borderRadius: 8,
  },
});

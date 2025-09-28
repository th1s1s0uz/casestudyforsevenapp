import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getAllTasks, deleteTask } from '@/queries/tasks';
import { Task } from '@/types';

interface UseTasksOptions {
  autoLoad?: boolean;
  sortBy?: 'created_at' | 'name' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  loadTasks: () => Promise<void>;
  refreshTasks: () => Promise<void>;
  deleteTaskById: (id: number, name: string) => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for managing tasks data fetching and operations
 * @param options - Configuration options for the hook
 * @returns Object with tasks data and operations
 */
export const useTasks = (options: UseTasksOptions = {}): UseTasksReturn => {
  const { 
    autoLoad = true, 
    sortBy = 'created_at', 
    sortOrder = 'desc' 
  } = options;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortTasks = useCallback((tasks: Task[]) => {
    return tasks.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 2;
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 2;
          break;
        default:
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [sortBy, sortOrder]);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllTasks();
      const sortedTasks = sortTasks(data);
      setTasks(sortedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load tasks';
      setError(errorMessage);
      Alert.alert('Error', 'Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [sortTasks]);

  const refreshTasks = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      const data = await getAllTasks();
      const sortedTasks = sortTasks(data);
      setTasks(sortedTasks);
    } catch (error) {
      console.error('Error refreshing tasks:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh tasks';
      setError(errorMessage);
      Alert.alert('Error', 'Failed to refresh tasks. Please try again.');
    } finally {
      setRefreshing(false);
    }
  }, [sortTasks]);

  const deleteTaskById = useCallback(async (id: number, name: string) => {
    return new Promise<void>((resolve, reject) => {
      Alert.alert(
        'Delete Task',
        `Are you sure you want to delete "${name}"?`,
        [
          { text: 'Cancel', style: 'cancel', onPress: () => reject(new Error('Cancelled')) },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteTask(id);
                setTasks(prev => prev.filter(task => task.id !== id));
                Alert.alert('Success', 'Task deleted successfully!');
                resolve();
              } catch (error) {
                console.error('Error deleting task:', error);
                Alert.alert('Error', 'Failed to delete task.');
                reject(error);
              }
            }
          }
        ]
      );
    });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-load tasks when component mounts
  useFocusEffect(
    useCallback(() => {
      if (autoLoad) {
        loadTasks();
      }
    }, [autoLoad, loadTasks])
  );

  return {
    tasks,
    loading,
    refreshing,
    error,
    loadTasks,
    refreshTasks,
    deleteTaskById,
    clearError,
  };
};

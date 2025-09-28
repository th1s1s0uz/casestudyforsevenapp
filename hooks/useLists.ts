import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getAllLists } from '@/queries/lists';
import { List } from '@/types';

interface UseListsOptions {
  autoLoad?: boolean;
}

interface UseListsReturn {
  lists: List[];
  loading: boolean;
  error: string | null;
  loadLists: () => Promise<void>;
  clearError: () => void;
  getListById: (id: number) => List | undefined;
  getListName: (id: number) => string;
}

/**
 * Custom hook for managing lists data fetching and operations
 * @param options - Configuration options for the hook
 * @returns Object with lists data and operations
 */
export const useLists = (options: UseListsOptions = {}): UseListsReturn => {
  const { autoLoad = true } = options;

  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllLists();
      setLists(data);
    } catch (error) {
      console.error('Error loading lists:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load lists';
      setError(errorMessage);
      Alert.alert('Error', 'Failed to load lists. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getListById = useCallback((id: number) => {
    return lists.find(list => list.id === id);
  }, [lists]);

  const getListName = useCallback((id: number) => {
    const list = getListById(id);
    return list ? list.name : 'Unknown List';
  }, [getListById]);

  // Auto-load lists when component mounts
  useFocusEffect(
    useCallback(() => {
      if (autoLoad) {
        loadLists();
      }
    }, [autoLoad, loadLists])
  );

  return {
    lists,
    loading,
    error,
    loadLists,
    clearError,
    getListById,
    getListName,
  };
};

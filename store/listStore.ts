import { create } from 'zustand';
import { getAllLists, createList, updateList, deleteList } from '@/queries/lists';
import { List } from '@/types';

interface ListStore {
  // State
  lists: List[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchLists: () => Promise<void>;
  createList: (name: string) => Promise<List>;
  updateList: (id: number, name: string) => Promise<void>;
  deleteList: (id: number) => Promise<void>;
  
  // Utility
  clearError: () => void;
  getListById: (id: number) => List | undefined;
  getDefaultList: () => List | undefined;
}

export const useListStore = create<ListStore>((set, get) => ({
  // Initial state
  lists: [],
  loading: false,
  error: null,

  // Fetch all lists
  fetchLists: async () => {
    try {
      set({ loading: true, error: null });
      const data = await getAllLists();
      set({ lists: data, loading: false });
    } catch (error) {
      console.error('Error fetching lists:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch lists',
        loading: false 
      });
    }
  },

  // Create new list
  createList: async (name) => {
    try {
      set({ loading: true, error: null });
      await createList(name);
      
      // Refresh lists after creation
      const data = await getAllLists();
      set({ lists: data, loading: false });
      
      // Return the first list (assuming it's the one we just created)
      return data[0];
    } catch (error) {
      console.error('Error creating list:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create list',
        loading: false 
      });
      throw error;
    }
  },

  // Update list
  updateList: async (id, name) => {
    try {
      set({ loading: true, error: null });
      await updateList(id, name);
      
      // Refresh lists after update
      const data = await getAllLists();
      set({ lists: data, loading: false });
    } catch (error) {
      console.error('Error updating list:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update list',
        loading: false 
      });
      throw error;
    }
  },

  // Delete list
  deleteList: async (id) => {
    try {
      set({ loading: true, error: null });
      await deleteList(id);
      
      // Refresh lists after deletion
      const data = await getAllLists();
      set({ lists: data, loading: false });
    } catch (error) {
      console.error('Error deleting list:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete list',
        loading: false 
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Get list by ID
  getListById: (id) => {
    return get().lists.find(list => list.id === id);
  },

  // Get default list (first list or create one)
  getDefaultList: () => {
    const { lists } = get();
    
    if (lists.length > 0) {
      return lists[0];
    }

    return undefined;
  },
}));

import { create } from 'zustand';
import { getAllLists, createList, updateList, deleteList } from '@/queries/lists';
import { List } from '@/types';

interface ListStore {
  lists: List[];
  loading: boolean;
  error: string | null;

  fetchLists: () => Promise<void>;
  createList: (name: string) => Promise<void>;
  updateList: (id: number, name: string) => Promise<void>;
  deleteList: (id: number) => Promise<void>;
  
  clearError: () => void;
  getListById: (id: number) => List | undefined;
  getDefaultList: () => List | undefined;
}

export const useListStore = create<ListStore>((set, get) => ({
  lists: [],
  loading: false,
  error: null,

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

  createList: async (name: string) => {
    try {
      set({ error: null });
      await createList(name);
      // Refresh lists after creation
      await get().fetchLists();
    } catch (error) {
      console.error('Error creating list:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create list'
      });
    }
  },

  updateList: async (id: number, name: string) => {
    try {
      set({ error: null });
      await updateList(id, name);
      // Update local state
      set(state => ({
        lists: state.lists.map(list => 
          list.id === id ? { ...list, name, updated_at: new Date().toISOString() } : list
        )
      }));
    } catch (error) {
      console.error('Error updating list:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update list'
      });
    }
  },

  deleteList: async (id: number) => {
    try {
      set({ error: null });
      await deleteList(id);
      // Remove from local state
      set(state => ({
        lists: state.lists.filter(list => list.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting list:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete list'
      });
    }
  },

  clearError: () => set({ error: null }),

  getListById: (id: number) => {
    return get().lists.find(list => list.id === id);
  },

  getDefaultList: () => {
    const lists = get().lists;
    // Return first list as default, or create a default one
    return lists.length > 0 ? lists[0] : undefined;
  },
}));
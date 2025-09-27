import { create } from 'zustand';
import { useTaskStore } from './taskStore';
import { useListStore } from './listStore';

interface GlobalStore {
  isInitialized: boolean;
  lastSyncTime: Date | null;
  
  initializeApp: () => Promise<void>;
  syncData: () => Promise<void>;
  resetApp: () => void;
}

export const useGlobalStore = create<GlobalStore>((set, get) => ({
  isInitialized: false,
  lastSyncTime: null,

  initializeApp: async () => {
    try {
      const { fetchTasks } = useTaskStore.getState();
      const { fetchLists } = useListStore.getState();
      
      await Promise.all([
        fetchTasks(),
        fetchLists()
      ]);
      
      set({ 
        isInitialized: true,
        lastSyncTime: new Date()
      });
    } catch (error) {
      console.error('Error initializing app:', error);
      set({ isInitialized: false });
    }
  },

  syncData: async () => {
    try {
      const { refreshTasks } = useTaskStore.getState();
      const { fetchLists } = useListStore.getState();
      
      await Promise.all([
        refreshTasks(),
        fetchLists()
      ]);
      
      set({ lastSyncTime: new Date() });
    } catch (error) {
      console.error('Error syncing data:', error);
    }
  },

  resetApp: () => {
    set({ 
      isInitialized: false,
      lastSyncTime: null
    });
  },
}));

export { useTaskStore } from './taskStore';
export { useListStore } from './listStore';

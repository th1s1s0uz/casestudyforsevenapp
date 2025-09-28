import { create } from 'zustand';
import { getAllTasks, createTask, updateTask, deleteTask } from '@/queries/tasks';
import { Task } from '@/types';

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;

  fetchTasks: () => Promise<void>;
  createTask: (taskData: {
    name: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    list_id: number;
  }) => Promise<void>;
  updateTask: (id: number, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  refreshTasks: () => Promise<void>;
  
  toggleTaskCompletion: (id: number) => void;
  updateTaskOptimistic: (id: number, updates: Partial<Task>) => void;
  
  clearError: () => void;
  getTaskById: (id: number) => Task | undefined;
  getTasksByPriority: (priority: 'low' | 'medium' | 'high') => Task[];
  getTasksByStatus: (completed: boolean) => Task[];
  getRecentTasks: (limit?: number) => Task[];
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,
  refreshing: false,

  fetchTasks: async () => {
    try {
      set({ loading: true, error: null });
      const data = await getAllTasks();
      const sortedTasks = data.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      set({ tasks: sortedTasks, loading: false });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch tasks',
        loading: false 
      });
    }
  },

  createTask: async (taskData) => {
    try {
      set({ loading: true, error: null });
      await createTask(taskData);
      
      const data = await getAllTasks();
      const sortedTasks = data.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      set({ tasks: sortedTasks, loading: false });
    } catch (error) {
      console.error('Error creating task:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create task',
        loading: false 
      });
      throw error;
    }
  },

  // Update task
  updateTask: async (id, updates) => {
    try {
      set({ loading: true, error: null });
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).map(([key, value]) => [key, value === null ? undefined : value])
      );
      await updateTask(id, cleanUpdates);
      
      const data = await getAllTasks();
      const sortedTasks = data.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      set({ tasks: sortedTasks, loading: false });
    } catch (error) {
      console.error('Error updating task:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update task',
        loading: false 
      });
      throw error;
    }
  },

  deleteTask: async (id) => {
    try {
      set({ loading: true, error: null });
      await deleteTask(id);
      
      const data = await getAllTasks();
      const sortedTasks = data.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      set({ tasks: sortedTasks, loading: false });
    } catch (error) {
      console.error('Error deleting task:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete task',
        loading: false 
      });
      throw error;
    }
  },

  refreshTasks: async () => {
    try {
      set({ refreshing: true, error: null });
      const data = await getAllTasks();
      const sortedTasks = data.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      set({ tasks: sortedTasks, refreshing: false });
    } catch (error) {
      console.error('Error refreshing tasks:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to refresh tasks',
        refreshing: false 
      });
    }
  },

  toggleTaskCompletion: (id) => {
    set((state) => ({
      tasks: state.tasks.map(task => 
        task.id === id 
          ? { ...task, is_completed: !task.is_completed }
          : task
      )
    }));
  },

  updateTaskOptimistic: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    }));
  },

  clearError: () => set({ error: null }),

  getTaskById: (id) => {
    return get().tasks.find(task => task.id === id);
  },

  getTasksByPriority: (priority) => {
    return get().tasks.filter(task => task.priority === priority);
  },

  getTasksByStatus: (completed) => {
    return get().tasks.filter(task => task.is_completed === completed);
  },

  getRecentTasks: (limit = 3) => {
    return get().tasks.slice(0, limit);
  },
}));

import { useCallback, useMemo, useState } from 'react';
import { Task } from '@/types';

interface UseTaskFiltersOptions {
  tasks: Task[];
}

interface UseTaskFiltersReturn {
  searchQuery: string;
  filterPriority: 'all' | 'high' | 'medium' | 'low';
  filterStatus: 'all' | 'completed' | 'pending';
  filterList: number | 'all';
  
  setSearchQuery: (query: string) => void;
  setFilterPriority: (priority: 'all' | 'high' | 'medium' | 'low') => void;
  setFilterStatus: (status: 'all' | 'completed' | 'pending') => void;
  setFilterList: (listId: number | 'all') => void;
  clearAllFilters: () => void;
  
  filteredTasks: Task[];
  hasActiveFilters: boolean;
}

/**
 * Custom hook for managing task filtering logic
 * @param options - Configuration options
 * @returns Object with filter states, actions, and filtered data
 */
export const useTaskFilters = ({ tasks }: UseTaskFiltersOptions): UseTaskFiltersReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');
  const [filterList, setFilterList] = useState<number | 'all'>('all');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = searchQuery === '' || 
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'completed' && task.is_completed) ||
        (filterStatus === 'pending' && !task.is_completed);
      
      const matchesList = filterList === 'all' || task.list_id === filterList;
      
      return matchesSearch && matchesPriority && matchesStatus && matchesList;
    });
  }, [tasks, searchQuery, filterPriority, filterStatus, filterList]);

  const hasActiveFilters = useMemo(() => {
    return searchQuery !== '' || 
           filterPriority !== 'all' || 
           filterStatus !== 'all' || 
           filterList !== 'all';
  }, [searchQuery, filterPriority, filterStatus, filterList]);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setFilterPriority('all');
    setFilterStatus('all');
    setFilterList('all');
  }, []);

  return {
    searchQuery,
    filterPriority,
    filterStatus,
    filterList,
    
    setSearchQuery,
    setFilterPriority,
    setFilterStatus,
    setFilterList,
    clearAllFilters,
    
    filteredTasks,
    hasActiveFilters,
  };
};

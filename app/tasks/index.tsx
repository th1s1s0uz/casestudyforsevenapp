import { Stack, Link } from 'expo-router';
import { useCallback, useState, useMemo } from 'react';
import { FlatList, Text, View, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';

import { Container } from '@/components/Container';
import { SearchBar } from '@/components/SearchBar';
import { FilterSection } from '@/components/FilterSection';
import { TaskCard } from '@/components/TaskCard';
import { ScreenTitles, NavigationHelpers } from '@/constants/navigation';
import { Task } from '@/types';
import { parseTaskName, parseChecklistFromDescription } from '@/utils/taskUtils';
import { useTasks } from '@/hooks/useTasks';
import { useLists } from '@/hooks/useLists';
import { useTaskFilters } from '@/hooks/useTaskFilters';

export default function TasksScreen() {
  const [deleting, setDeleting] = useState<number | null>(null);

  const { tasks, loading, refreshing, refreshTasks, deleteTaskById } = useTasks();
  const { lists, getListName } = useLists();
  const {
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
    hasActiveFilters
  } = useTaskFilters({ tasks });

  const handleDeleteTask = useCallback(async (taskId: number, taskName: string) => {
    try {
      setDeleting(taskId);
      await deleteTaskById(taskId, taskName);
    } catch (error) {
            } finally {
              setDeleting(null);
            }
  }, [deleteTaskById]);

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, [setSearchQuery]);

  const handleSearchClear = useCallback(() => {
    setSearchQuery('');
  }, [setSearchQuery]);

  const handlePriorityFilter = useCallback((priority: 'all' | 'high' | 'medium' | 'low') => {
    setFilterPriority(priority);
  }, [setFilterPriority]);

  const handleStatusFilter = useCallback((status: 'all' | 'completed' | 'pending') => {
    setFilterStatus(status);
  }, [setFilterStatus]);

  const handleListFilter = useCallback((listId: number | 'all') => {
    setFilterList(listId);
  }, [setFilterList]);

  const ListHeaderComponent = useMemo(() => {
    return () => (
      <View className="pt-6 pb-6">
        <View className="mb-4">
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearchChange}
            placeholder="Search tasks..."
            onClear={handleSearchClear}
          />
                  </View>
                  
        <FilterSection
          filterPriority={filterPriority}
          filterStatus={filterStatus}
          filterList={filterList}
          lists={lists}
          onPriorityFilter={handlePriorityFilter}
          onStatusFilter={handleStatusFilter}
          onListFilter={handleListFilter}
        />

        <View className="mb-6">
          <Link href={NavigationHelpers.getCreateTaskRoute()} asChild>
            <TouchableOpacity>
              <View className="p-4 bg-secondary-400 rounded-2xl flex-row items-center justify-center">
                <Text className="text-white text-lg font-semibold">Create New Task</Text>
              </View>
          </TouchableOpacity>
          </Link>
        </View>
      </View>
    );
  }, [filterPriority, filterStatus, filterList, lists, handleSearchChange, handleSearchClear, handlePriorityFilter, handleStatusFilter, handleListFilter]);

  const renderTaskItem = ({ item }: { item: Task }) => (
    <TaskCard
      task={item}
      variant="full"
      onDelete={handleDeleteTask}
      deleting={deleting}
      getListName={getListName}
    />
  );

  const ListEmptyComponent = () => (
    <View className="p-8 items-center">
      {loading ? (
            <ActivityIndicator size="large" color="#3b82f6" />
      ) : hasActiveFilters ? (
        <View className="items-center">
          <Text className="text-gray-500 text-center mb-4">
            No tasks found matching your filters.
            </Text>
          <TouchableOpacity
            onPress={clearAllFilters}
            className="px-4 py-2 bg-primary-500 rounded-lg"
          >
            <Text className="text-white font-medium">Clear Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text className="text-gray-500 text-center">
          No tasks found. Create your first task!
        </Text>
      )}
    </View>
  );

  return (
    <Container
      showHeader={true}
      headerTitle={ScreenTitles.TASKS}
      headerSubtitle={'Manage and organize your tasks efficiently!'}
    >
      <Stack.Screen options={{ title: ScreenTitles.TASKS, headerShown: false }} />
      <View className="flex-1 bg-primary-50">
            <FlatList
          data={filteredTasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={ListEmptyComponent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
              onRefresh={refreshTasks}
                  colors={['#3b82f6']}
                  tintColor="#3b82f6"
                />
              }
              contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
        />
      </View>
    </Container>
  );
}
import { Stack, Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Text, View, ActivityIndicator, TouchableOpacity, Alert, RefreshControl } from 'react-native';

import { Container } from '@/components/Container';
import { AppRoutes, ScreenTitles, NavigationHelpers } from '@/constants/navigation';
import { getAllTasks, deleteTask, toggleTaskCompletion } from '@/queries/tasks';
import { Task } from '@/types';

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [toggling, setToggling] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
      Alert.alert('Error', 'Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const data = await getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error refreshing tasks:', error);
      Alert.alert('Error', 'Failed to refresh tasks. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteTask = async (taskId: number, taskName: string) => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${taskName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(taskId);
              await deleteTask(taskId);
              setTasks(prev => prev.filter(task => task.id !== taskId));
              Alert.alert('Success', 'Task deleted successfully!');
            } catch (error) {
              console.error('Error deleting task:', error);
              Alert.alert('Error', 'Failed to delete task. Please try again.');
            } finally {
              setDeleting(null);
            }
          }
        }
      ]
    );
  };

  const handleToggleTask = async (taskId: number, currentStatus: boolean) => {
    try {
      setToggling(taskId);
      await toggleTaskCompletion(taskId, !currentStatus);
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, is_completed: !currentStatus }
          : task
      ));
    } catch (error) {
      console.error('Error toggling task:', error);
      Alert.alert('Error', 'Failed to update task. Please try again.');
    } finally {
      setToggling(null);
    }
  };


  const parseChecklistFromDescription = (description: string | null) => {
    if (!description) return { description: '', checklist: [] };
    
    const checklistMatch = description.match(/📋 Checklist:\n((?:• .+\n?)*)/);
    if (!checklistMatch) return { description, checklist: [] };
    
    const checklistText = checklistMatch[1];
    const checklist = checklistText
      .split('\n')
      .filter(line => line.trim().startsWith('•'))
      .map(line => line.replace('• ', '').trim());
    
    const cleanDescription = description.replace(/\n\n📋 Checklist:\n(?:• .+\n?)*/g, '').trim();
    
    return { description: cleanDescription, checklist };
  };

  const parseTaskName = (name: string) => {
    const emojiMatch = name.match(/^(\p{Emoji})\s+(.+)$/u);
    if (emojiMatch) {
      return {
        icon: emojiMatch[1],
        name: emojiMatch[2]
      };
    }
    return {
      icon: '📝', 
      name: name
    };
  };

  const renderTaskItem = ({ item }: { item: Task }) => {
    const { description, checklist } = parseChecklistFromDescription(item.description);
    const { icon, name } = parseTaskName(item.name);
    
    return (
      <View className="bg-glass-card mb-4 rounded-2xl border border-gray-100 overflow-hidden">
        <Link href={`/tasks/${item.id}` as any} asChild>
          <TouchableOpacity 
            className="p-5"
            activeOpacity={0.7}
          >
            <View className="flex-row items-start mb-3">
              <View className="bg-gray-100 w-12 h-12 rounded-xl items-center justify-center mr-4">
                <Text className="text-2xl">{icon}</Text>
              </View>
              <View className="flex-1">
                <Text className={`text-xl font-bold mb-2 ${item.is_completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                  {name}
                </Text>
                
                {description && (
                  <Text className={`text-sm leading-5 mb-3 ${item.is_completed ? 'text-gray-400' : 'text-gray-600'}`}>
                    {description}
                  </Text>
                )}
                
                <View className="flex-row items-center flex-wrap gap-2">
                  <View className={`flex-row items-center px-2 py-1 rounded-lg ${
                    item.priority === 'high' ? 'bg-accent-red-100' : 
                    item.priority === 'medium' ? 'bg-accent-orange-100' : 'bg-accent-green-100'
                  }`}>
                    <View className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      item.priority === 'high' ? 'bg-accent-red-500' : 
                      item.priority === 'medium' ? 'bg-accent-orange-500' : 'bg-accent-green-500'
                    }`} />
                    <Text className={`text-xs font-medium capitalize ${
                      item.priority === 'high' ? 'text-accent-red-700' : 
                      item.priority === 'medium' ? 'text-accent-orange-700' : 'text-accent-green-700'
                    }`}>
                      {item.priority || 'medium'}
                    </Text>
                  </View>
                  
                  {checklist.length > 0 && (
                    <View className="bg-primary-100 px-2 py-1 rounded-lg">
                      <Text className="text-xs font-medium text-primary-700">
                        📋 {checklist.length}
                      </Text>
                    </View>
                  )}
                  
                  <View className={`px-2 py-1 rounded-lg ${
                    item.is_completed ? 'bg-accent-green-100' : 'bg-accent-orange-100'
                  }`}>
                    <Text className={`text-xs font-medium ${
                      item.is_completed ? 'text-accent-green-700' : 'text-accent-orange-700'
                    }`}>
                      {item.is_completed ? '✅ Done' : '⏳ Pending'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Link>
        
        <View className="flex-row items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
        <Link href={`/tasks/${item.id}` as any} asChild>

          <TouchableOpacity className="flex-row items-center">
            <Text className="text-xs font-medium text-primary-600">
              Tap to view details
            </Text>
          </TouchableOpacity>
          </Link>
          
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => handleDeleteTask(item.id, name)}
              disabled={deleting === item.id}
              className="px-4 py-2 rounded-full items-center justify-center bg-accent-red-100"
            >
              {deleting === item.id ? (
                <ActivityIndicator size="small" color="#ef4444" />
              ) : (
                <Text className="text-accent-red-600 text-sm font-bold">Delete</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };


  return (
    <Container 
      showHeader={true}
      headerTitle="All Tasks"
      headerSubtitle="Manage and organize your tasks efficiently!"
    >
      <Stack.Screen options={{ title: ScreenTitles.TASKS, headerShown: false }} />
      <View className="flex-1 bg-primary-50">
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={() => (
            <View className="pt-6 pb-6">
              <View className="mb-6">
                <Link href={AppRoutes.CREATE_TASK} asChild>
                  <TouchableOpacity>
                    <View className="p-4 bg-secondary-400 rounded-2xl flex-row items-center justify-center">
                      <Text className="text-white text-lg font-semibold">Create New Task</Text>
                    </View>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            loading ? (
              <View className="p-8 items-center rounded-2xl bg-glass-card border border-gray-200">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="mt-4 text-center text-gray-600">
                  Loading your tasks...
                </Text>
              </View>
            ) : (
              <View className="p-8 items-center rounded-2xl bg-glass-card border border-gray-200">
                <Text className="mb-2 text-xl font-semibold text-gray-900">
                  No tasks yet
                </Text>
                <Text className="text-center text-gray-600 mb-4">
                  Create your first task to get organized and boost your productivity!
                </Text>
                <Link href={AppRoutes.CREATE_TASK} asChild>
                  <TouchableOpacity>
                    <View className="px-6 py-3 bg-white rounded-xl border border-gray-400">
                      <Text className="text-black font-semibold">Get Started</Text>
                    </View>
                  </TouchableOpacity>
                </Link>
              </View>
            )
          )}
          renderItem={renderTaskItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3b82f6']}
              tintColor="#3b82f6"
            />
          }
        />
      </View>
    </Container>
  );
}

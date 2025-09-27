import { Stack, Link, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Text, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';

import { Container } from '@/components/Container';
import {  ScreenTitles, NavigationHelpers } from '@/constants/navigation';
import { useTaskStore } from '@/store/taskStore';

export default function Home() {
  const { 
    tasks, 
    loading, 
    refreshing, 
    fetchTasks, 
    refreshTasks, 
    getRecentTasks 
  } = useTaskStore();

  useFocusEffect(
    useCallback(() => {
      if (tasks.length === 0) {
        fetchTasks();
      }
    }, [tasks.length, fetchTasks])
  );

  const onRefresh = useCallback(async () => {
    await refreshTasks();
  }, [refreshTasks]);

  const completedTasks = tasks.filter(task => task.is_completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const recentTasks = getRecentTasks(3);

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


  return (
    <Container>
      <Stack.Screen options={{ title: ScreenTitles.HOME, headerShown: false }} />
      <View className="flex-1 bg-primary-50">
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ paddingHorizontal: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3b82f6']}
              tintColor="#3b82f6"
            />
          }
        >
          <View className="pt-16 pb-6 px-6">
            <Text className="text-sm mb-1 text-gray-400">Hello, User</Text>
            <Text className="text-3xl font-bold mb-2 text-gray-900">
              Your Tasks
            </Text>
            <Text className="text-gray-600">
              Organize efficiently and get things done! 🎯
            </Text>
          </View>
          <View className="mb-6">
            <Link href={NavigationHelpers.getTasksRoute()} asChild>
              <TouchableOpacity className="mb-4">
                <View className="p-6 bg-primary-400 rounded-3xl">
                  <View className="flex-row justify-between items-start mb-4">
                    <View>
                      <Text className="mb-1 text-2xl font-bold text-white">
                        All Tasks
                      </Text>
                      <View className="flex-row items-center">
                        <View className="rounded-full px-3 py-1 mr-2 bg-glass-overlay">
                          <Text className="font-bold text-lg text-white">
                            {tasks.length}
                          </Text>
                        </View>
                        <Text className="text-sm text-white/90">
                          total tasks
                        </Text>
                      </View>
                    </View>
                    <View className="rounded-full p-2 bg-glass-overlay">
                      <Text className="text-sm text-white">
                        see all tasks
                      </Text>
                    </View>
                  </View>

                  <View className="rounded-full h-2 mb-2 bg-glass-overlay">
                    <View
                      className="rounded-full h-2 bg-white"
                      style={{
                        width: tasks.length > 0 ? `${(completedTasks / tasks.length) * 100}%` : '0%'
                      }}
                    />
                  </View>
                  <Text className="text-sm text-white/80">
                    {completedTasks} of {tasks.length} completed
                  </Text>
                </View>
              </TouchableOpacity>
            </Link>

            <Link href={NavigationHelpers.getCreateTaskRoute()} asChild>
              <TouchableOpacity>
                <View className="p-6 bg-secondary-400 rounded-3xl">
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="mb-1 text-2xl font-bold text-white">
                        Create Task
                      </Text>
                      <Text className="text-sm text-white/90">
                        Add a new task to your list
                      </Text>
                    </View>
                    <View className="rounded-full p-2 bg-glass-overlay">
                      <Text className="text-sm text-white">
                        create task
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          </View>

          <View className="mb-6">
            <Text className="mb-3 text-lg font-semibold text-gray-900">
              Overview
            </Text>
            <View className="flex-row gap-3">
              <View className="flex-1 rounded-2xl p-4  border border-gray-500 bg-glass-card">
                <View className="w-10 h-10 rounded-full items-center justify-center mb-2 bg-accent-green-100">
                  <Text className="text-lg text-accent-green-600">
                    ✓
                  </Text>
                </View>
                <Text className="font-bold text-2xl text-gray-900">
                  {completedTasks}
                </Text>
                <Text className="text-sm text-gray-600">
                  Completed
                </Text>
              </View>

              <View className="flex-1 p-4 rounded-2xl border border-gray-500 bg-glass-card">
                <View className="w-10 h-10 rounded-full items-center justify-center mb-2 bg-accent-orange-100">
                  <Text className="text-lg text-accent-orange-600">
                    ⏳
                  </Text>
                </View>
                <Text className="font-bold text-2xl text-gray-900">
                  {pendingTasks}
                </Text>
                <Text className="text-sm text-gray-600">
                  Pending
                </Text>
              </View>
            </View>
          </View>

          {recentTasks.length > 0 && (
            <View className="mb-6">
              <Text className="mb-3 text-lg font-semibold text-gray-900">
                Recent Tasks
              </Text>
              {recentTasks.map((task) => {
                const { icon, name } = parseTaskName(task.name);
                return (
                  <Link key={task.id} href={NavigationHelpers.getTaskDetailRoute(task.id) as any} asChild>
                    <TouchableOpacity
                      className={`p-4 mb-2 rounded-2xl border ${
                        task.priority === 'high' 
                          ? 'bg-accent-red-50 border-accent-red-200' 
                          : task.priority === 'medium' 
                            ? 'bg-accent-orange-50 border-accent-orange-200' 
                            : 'bg-accent-green-50 border-accent-green-200'
                      }`}
                      activeOpacity={0.7}
                    >
                      <View className="flex-row items-center">
                      <View className="w-10 h-10 items-center justify-center mr-3 bg-white rounded-xl">
                        <Text className="text-lg">{icon}</Text>
                      </View>
                      <View className="flex-1">
                        <Text 
                          className={`font-medium ${task.is_completed ? 'line-through text-gray-400' : 'text-gray-900'}`}
                        >
                          {name}
                        </Text>
                        <Text className={`text-sm ${task.is_completed ? 'text-accent-green-700' : 'text-accent-orange-700'}`}>
                          {task.is_completed ? 'Completed' : 'Pending'}
                        </Text>
                      </View>
                    </View>
                    </TouchableOpacity>
                  </Link>
                );
              })}
            </View>
          )}

          {recentTasks.length === 0 && (
            <View className="p-6 items-center rounded-2xl bg-glass-card">
              <Text className="mb-3 text-6xl">
                🚀
              </Text>
              <Text className="mb-2 text-lg font-semibold text-gray-900">
                Ready to get started?
              </Text>
              <Text className="text-center text-gray-600">
                Create your first task and start organizing your day !
              </Text>
            </View>
          )}

          <View className="h-6" />
        </ScrollView>
      </View>
    </Container>
  );
}

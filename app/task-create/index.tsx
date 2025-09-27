import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { Text, View, TextInput, Alert, ScrollView, TouchableOpacity } from 'react-native';

import { Container } from '@/components/Container';
import { ScreenTitles } from '@/constants/navigation';
import { createTask } from '@/queries/tasks';
import { getAllLists, createList } from '@/queries/lists';
import { Button } from '@/components/Button';

interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

const TASK_ICONS = [
  '📝', '✅', '🎯', '💼', '🏠', '🛒', '📚', '🎵',
  '🏃‍♂️', '🍳', '💡', '🎨', '📱', '🌟', '❤️', '🏆',
  '💰', '🎮', '🌍', '📊', '🔧', '🎪', '🚀', '⚡',
  '🔥', '💎', '🎉', '🌈', '🎭', '🎲', '🎸', '📷'
];

export default function CreateTaskScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [loading, setLoading] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(TASK_ICONS[0]);

  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [newSubTaskText, setNewSubTaskText] = useState('');

  const getOrCreateDefaultList = async () => {
    try {
      const lists = await getAllLists();
      if (lists.length > 0) {
        return lists[0].id;
      }

      await createList('📝 My Tasks');
      const newLists = await getAllLists();
      return newLists[0].id;
    } catch (error) {
      console.error('Error with default list:', error);
      throw error;
    }
  };

  const addSubTask = () => {
    if (!newSubTaskText.trim()) return;

    const newSubTask: SubTask = {
      id: Date.now().toString(),
      text: newSubTaskText.trim(),
      completed: false,
    };

    setSubTasks(prev => [...prev, newSubTask]);
    setNewSubTaskText('');
  };

  const removeSubTask = (id: string) => {
    setSubTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleSubTask = (id: string) => {
    setSubTasks(prev => prev.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleCreateTask = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a task name');
      return;
    }

    try {
      setLoading(true);

      const defaultListId = await getOrCreateDefaultList();

      let fullDescription = description.trim();
      if (subTasks.length > 0) {
        const subTasksText = subTasks.map(task => `• ${task.text}`).join('\n');
        fullDescription = fullDescription
          ? `${fullDescription}\n\n📋 Checklist:\n${subTasksText}`
          : `📋 Checklist:\n${subTasksText}`;
      }

      const formattedName = `${selectedIcon} ${name.trim()}`;

      await createTask({
        name: formattedName,
        description: fullDescription || undefined,
        priority,
        list_id: defaultListId,
      });
      Alert.alert('Success', 'Task created successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error creating task:', error);
      Alert.alert('Error', 'Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Container
      showHeader={true}
      headerTitle="Create New Task"
      headerSubtitle="Add a new task with details and steps! ✨"
    >
      <Stack.Screen options={{ title: ScreenTitles.CREATE_TASK, headerShown: false }} />
      <View className="flex-1 bg-primary-50">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
        >
          <View className={`mb-6 mt-6 p-5 rounded-2xl border ${priority === 'high'
              ? 'bg-accent-red-50 border-accent-red-200'
              : priority === 'medium'
                ? 'bg-accent-orange-50 border-accent-orange-200'
                : 'bg-accent-green-50 border-accent-green-200'
            }`}>
            <View className="flex-row items-start">
              <View className="bg-gray-100 w-12 h-12 rounded-xl items-center justify-center mr-4">
                <Text className="text-2xl">{selectedIcon}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-gray-900 mb-2">
                  {name || 'Your Task Name'}
                </Text>
                {description && (
                  <Text className="text-sm text-gray-600 mb-3 leading-5">{description}</Text>
                )}
                <View className="flex-row items-center flex-wrap gap-2">
                  <View className={`flex-row items-center px-2 py-1 rounded-lg ${priority === 'high' ? 'bg-accent-red-100' :
                    priority === 'medium' ? 'bg-accent-orange-100' : 'bg-accent-green-100'
                    }`}>
                    <View className={`w-1.5 h-1.5 rounded-full mr-1.5 ${priority === 'high' ? 'bg-accent-red-500' :
                      priority === 'medium' ? 'bg-accent-orange-500' : 'bg-accent-green-500'
                      }`} />
                    <Text className={`text-xs font-medium capitalize ${priority === 'high' ? 'text-accent-red-700' :
                      priority === 'medium' ? 'text-accent-orange-700' : 'text-accent-green-700'
                      }`}>
                      {priority}
                    </Text>
                  </View>

                  {subTasks.length > 0 && (
                    <View className="bg-primary-100 px-2 py-1 rounded-lg">
                      <Text className="text-xs font-medium text-primary-700">
                        📋 {subTasks.length} steps
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Task Name *</Text>
            <View className="bg-glass-card rounded-2xl border border-gray-100 p-4">
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g., Complete project proposal, Buy groceries..."
                className="text-gray-900 text-base"
                maxLength={200}
                autoFocus
                placeholderTextColor="#9ca3af"
              />
            </View>
            <Text className="text-sm text-gray-500 mt-2 ml-1">
              {name.length}/200 characters
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Description (Optional)</Text>
            <View className="bg-glass-card rounded-2xl border border-gray-100 p-4">
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Add more details about this task..."
                className="text-gray-900 text-base"
                multiline
                numberOfLines={3}
                maxLength={300}
                placeholderTextColor="#9ca3af"
              />
            </View>
            <Text className="text-sm text-gray-500 mt-2 ml-1">
              {description.length}/300 characters
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Choose Task Icon</Text>
            <View className="bg-glass-card rounded-2xl border border-gray-100 p-4">
              <View className="flex-row flex-wrap gap-3">
                {TASK_ICONS.map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    onPress={() => setSelectedIcon(icon)}
                    className={`w-12 h-12 rounded-xl items-center justify-center border-2 ${selectedIcon === icon
                      ? 'border-primary-500 bg-primary-100'
                      : 'border-gray-200 bg-gray-50'
                      }`}
                  >
                    <Text className="text-xl">{icon}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Task Steps/Checklist (Optional)</Text>
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1 bg-glass-card rounded-2xl border border-gray-100 p-4">
                <TextInput
                  value={newSubTaskText}
                  onChangeText={setNewSubTaskText}
                  placeholder="Add a step or checklist item..."
                  className="text-gray-900 text-base"
                  maxLength={100}
                  onSubmitEditing={addSubTask}
                  returnKeyType="done"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <Button
                title="Add"
                variant="primary"
                onPress={addSubTask}
                disabled={!newSubTaskText.trim()}
                className={`px-6 ${!newSubTaskText.trim() ? 'bg-gray-300 border-gray-300' : ''}`}
              />
            </View>

            {subTasks.length > 0 && (
              <View className="bg-glass-card rounded-2xl border border-gray-100 p-4 mb-4">
                <Text className="text-sm font-semibold text-gray-800 mb-3">
                  📋 Task Steps ({subTasks.length})
                </Text>
                {subTasks.map((subTask, index) => (
                  <View key={subTask.id} className="flex-row items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <View className="flex-row items-center flex-1">
                      <Text className="text-sm text-gray-500 mr-3 w-6 font-medium">
                        {index + 1}.
                      </Text>
                      <TouchableOpacity
                        onPress={() => toggleSubTask(subTask.id)}
                        className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${subTask.completed
                          ? 'bg-accent-green-500 border-accent-green-500'
                          : 'border-gray-300'
                          }`}
                      >
                        {subTask.completed && (
                          <Text className="text-white text-xs font-bold">✓</Text>
                        )}
                      </TouchableOpacity>
                      <Text className={`flex-1 text-sm ${subTask.completed
                        ? 'text-gray-400 line-through'
                        : 'text-gray-800'
                        }`}>
                        {subTask.text}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => removeSubTask(subTask.id)}
                      className="ml-2 p-2 w-20 bg-accent-red-100 items-center justify-center rounded-full"
                    >
                      <Text className="text-accent-red-600 font-bold text-sm">Delete</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {subTasks.length === 0 && (
              <View className="bg-glass-card rounded-2xl border border-gray-100 p-6">
                <Text className="text-sm text-gray-500 text-center">
                  No steps added yet. Break down your task into smaller steps above.
                </Text>
              </View>
            )}
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Priority</Text>
            <View className="flex-row gap-3">
              {(['low', 'medium', 'high'] as const).map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPriority(p)}
                  className={`flex-1 p-4 rounded-2xl border-2 ${priority === p
                    ? p === 'high'
                      ? 'bg-accent-red-100 border-accent-red-300'
                      : p === 'medium'
                        ? 'bg-accent-orange-100 border-accent-orange-300'
                        : 'bg-accent-green-100 border-accent-green-300'
                    : 'bg-glass-card border-gray-200'
                    }`}
                >
                  <View className="flex-row items-center justify-center">
                    <View className={`w-2 h-2 rounded-full mr-2 ${p === 'high' ? 'bg-accent-red-500' :
                      p === 'medium' ? 'bg-accent-orange-500' : 'bg-accent-green-500'
                      }`} />
                    <Text
                      className={`text-center font-semibold capitalize ${priority === p
                        ? p === 'high'
                          ? 'text-accent-red-700'
                          : p === 'medium'
                            ? 'text-accent-orange-700'
                            : 'text-accent-green-700'
                        : 'text-gray-700'
                        }`}
                    >
                      {p}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="gap-4">
            <Button
              title={loading ? "Creating..." : "Create Task"}
              variant="primary"
              onPress={handleCreateTask}
              disabled={loading || !name.trim()}
              className={loading || !name.trim() ? 'bg-gray-300 border-gray-300' : ''}
            />

            <Button
              title="Cancel"
              variant="tertiary"
              onPress={() => router.back()}
              disabled={loading}
              className="bg-gray-200 border-gray-200"
            />
          </View>
        </ScrollView>
      </View>
    </Container>
  );
}

import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { Text, View, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';

import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { ScreenTitles } from '@/constants/navigation';
import { getTaskById, toggleTaskCompletion, deleteTask } from '@/queries/tasks';
import { useTaskStore } from '@/store/taskStore';
import { Task } from '@/types';
import { parseTaskName, parseDetailedChecklistFromDescription, removeChecklistFromDescription, createFullDescription } from '@/utils/taskUtils';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams();
  const taskId = parseInt(id as string);

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [originalChecklistItems, setOriginalChecklistItems] = useState<ChecklistItem[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { updateTask, updateTaskOptimistic, toggleTaskCompletion: storeToggleCompletion, deleteTask: storeDeleteTask } = useTaskStore();

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = async () => {
    try {
      setLoading(true);
      const taskData = await getTaskById(taskId);
      if (taskData) {
        setTask(taskData);
        parseChecklistFromDescription(taskData.description);
      } else {
        Alert.alert('Error', 'Task not found', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (error) {
      console.error('Error loading task:', error);
      Alert.alert('Error', 'Failed to load task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const parseChecklistFromDescription = (description: string | null) => {
    const items = parseDetailedChecklistFromDescription(description);
    setChecklistItems(items);
    setOriginalChecklistItems([...items]); 
    setHasUnsavedChanges(false);
  };

  const toggleChecklistItem = (itemId: string) => {
    const updatedItems = checklistItems.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    setChecklistItems(updatedItems);

    const hasChanges = JSON.stringify(updatedItems) !== JSON.stringify(originalChecklistItems);
    setHasUnsavedChanges(hasChanges);
  };

  const saveChecklistChanges = async () => {
    if (!task || !hasUnsavedChanges) return;

    try {
      setUpdating(true);

      // Remove ALL checklists from description and create new one
      const baseDescription = removeChecklistFromDescription(task.description);
      const newDescription = createFullDescription(baseDescription, checklistItems);

      await updateTask(task.id, { description: newDescription });
      setTask(prev => prev ? { ...prev, description: newDescription } : null);
      updateTaskOptimistic(task.id, { description: newDescription });

      setOriginalChecklistItems([...checklistItems]);
      setHasUnsavedChanges(false);
      Alert.alert('Success', 'Checklist updated successfully!');

    } catch (error) {
      console.error('Error updating checklist:', error);
      Alert.alert('Error', 'Failed to update checklist. Please try again.');
      setChecklistItems([...originalChecklistItems]);
      setHasUnsavedChanges(false);
    } finally {
      setUpdating(false);
    }
  };

  const discardChecklistChanges = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard your changes?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            setChecklistItems([...originalChecklistItems]);
            setHasUnsavedChanges(false);
          }
        }
      ]
    );
  };

  const handleToggleTaskCompletion = async () => {
    if (!task) return;

    try {
      setUpdating(true);
      const newStatus = !task.is_completed;

      // Optimistic update
      setTask(prev => prev ? { ...prev, is_completed: newStatus } : null);
      storeToggleCompletion(task.id);

      // Update in database
      await toggleTaskCompletion(task.id, newStatus);

    } catch (error) {
      console.error('Error toggling task:', error);
      Alert.alert('Error', 'Failed to update task status.');
      // Revert optimistic update on error
      setTask(prev => prev ? { ...prev, is_completed: task.is_completed } : null);
      storeToggleCompletion(task.id);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!task) return;

    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${parseTaskName(task.name).name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setUpdating(true);
              // Use store's deleteTask method
              await storeDeleteTask(task.id);
              Alert.alert('Success', 'Task deleted successfully!', [
                { text: 'OK', onPress: () => router.back() }
              ]);
            } catch (error) {
              console.error('Error deleting task:', error);
              Alert.alert('Error', 'Failed to delete task.');
            } finally {
              setUpdating(false);
            }
          }
        }
      ]
    );
  };

  const { icon, name } = parseTaskName(task?.name || 'Loading...');
  const cleanDescription = removeChecklistFromDescription(task?.description || '');

  return (
    <Container
      showHeader={true}
      headerTitle={'Task Details'}
      headerSubtitle={'Manage and track your task progress!'}
    >
      <Stack.Screen options={{ title: task ? name : ScreenTitles.TASK_DETAIL, headerShown: false }} />
      <View className="flex-1 bg-primary-50">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
        >
          <View className="pt-6 pb-6">
            {loading ? (
              <View className="p-8 items-center rounded-2xl bg-glass-card border border-gray-200">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="mt-4 text-center text-gray-600">
                  Loading task details...
                </Text>
              </View>
            ) : !task ? (
              <View className="p-8 items-center rounded-2xl bg-glass-card border border-gray-200">
                <Text className="mb-2 text-xl font-semibold text-gray-900">
                  Task not found
                </Text>
                <Text className="text-center text-gray-600 mb-4">
                  The task you're looking for doesn't exist or has been deleted.
                </Text>
                <Button
                  title="Go Back"
                  variant="primary"
                  onPress={() => router.back()}
                  className="px-6 py-3"
                />
              </View>
            ) : (
              <>
                <View className={`mb-6 p-5 rounded-2xl border ${task.priority === 'high'
                  ? 'bg-accent-red-50 border-accent-red-200'
                  : task.priority === 'medium'
                    ? 'bg-accent-orange-50 border-accent-orange-200'
                    : 'bg-accent-green-50 border-accent-green-200'
                  }`}>
                  <View className="flex-row items-start mb-4">
                    <View className="bg-gray-100 w-12 h-12 rounded-xl items-center justify-center mr-4">
                      <Text className="text-2xl">{icon}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className={`text-xl font-bold mb-2 ${task.is_completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {name}
                      </Text>

                      <View className="flex-row items-center flex-wrap gap-2">
                        <View className={`flex-row items-center px-2 py-1 rounded-lg ${task.priority === 'high' ? 'bg-accent-red-100' :
                          task.priority === 'medium' ? 'bg-accent-orange-100' : 'bg-accent-green-100'
                          }`}>
                          <View className={`w-1.5 h-1.5 rounded-full mr-1.5 ${task.priority === 'high' ? 'bg-accent-red-500' :
                            task.priority === 'medium' ? 'bg-accent-orange-500' : 'bg-accent-green-500'
                            }`} />
                          <Text className={`text-xs font-medium capitalize ${task.priority === 'high' ? 'text-accent-red-700' :
                            task.priority === 'medium' ? 'text-accent-orange-700' : 'text-accent-green-700'
                            }`}>
                            {task.priority || 'medium'}
                          </Text>
                        </View>

                        <View className={`px-2 py-1 rounded-lg ${task.is_completed ? 'bg-accent-green-100' : 'bg-accent-orange-100'
                          }`}>
                          <Text className={`text-xs font-medium ${task.is_completed ? 'text-accent-green-700' : 'text-accent-orange-700'
                            }`}>
                            {task.is_completed ? '✅ Done' : '⏳ Pending'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View className="pt-3 border-t border-gray-200">
                    <Text className="text-sm text-gray-500">
                      Created: {new Date(task.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                {cleanDescription && (
                  <View className="mb-6">
                    <Text className="text-lg font-semibold text-gray-900 mb-3">Description</Text>
                    <View className="bg-glass-card rounded-2xl border border-gray-100 p-4">
                      <Text className="text-gray-600 leading-5">{cleanDescription}</Text>
                    </View>
                  </View>
                )}

                {checklistItems.length > 0 && (
                  <View className="mb-6">
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-lg font-semibold text-gray-900">
                        📋 Task Steps ({checklistItems.filter(item => item.completed).length}/{checklistItems.length})
                      </Text>
                      {hasUnsavedChanges && (
                        <View className="bg-accent-orange-100 px-2 py-1 rounded-lg">
                          <Text className="text-xs font-medium text-accent-orange-700">Unsaved changes</Text>
                        </View>
                      )}
                    </View>

                    <View className="bg-glass-card rounded-2xl border border-gray-100 p-4">
                      {checklistItems.map((item, index) => (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => toggleChecklistItem(item.id)}
                          disabled={updating}
                          className="flex-row items-center py-3 border-b border-gray-100 last:border-b-0"
                        >
                          <Text className="text-sm text-gray-500 mr-3 w-6 font-medium">
                            {index + 1}.
                          </Text>
                          <View className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${item.completed
                            ? 'bg-accent-green-500 border-accent-green-500'
                            : 'border-gray-300'
                            }`}>
                            {item.completed && (
                              <Text className="text-white text-xs font-bold">✓</Text>
                            )}
                          </View>
                          <Text className={`flex-1 text-sm ${item.completed
                            ? 'text-gray-400 line-through'
                            : 'text-gray-800'
                            }`}>
                            {item.text}
                          </Text>
                        </TouchableOpacity>
                      ))}

                      {hasUnsavedChanges && (
                        <View className="flex-row gap-3 mt-4 pt-3 border-t border-gray-100">
                          <Button
                            title={updating ? "Saving..." : "Save Changes"}
                            variant="primary"
                            onPress={saveChecklistChanges}
                            disabled={updating}
                            className={`flex-1 ${updating ? 'bg-gray-300 border-gray-300' : 'bg-accent-green-500 border-accent-green-500'}`}
                          />
                          <Button
                            title="Discard"
                            variant="tertiary"
                            onPress={discardChecklistChanges}
                            disabled={updating}
                            className="flex-1"
                          />
                        </View>
                      )}
                    </View>
                  </View>
                )}
                <View className="gap-4">
                  <Button
                    title={task.is_completed ? "Mark as Pending" : "Mark as Completed"}
                    variant={"primary"}
                    onPress={handleToggleTaskCompletion}
                    disabled={updating}
                  />

                  <Button
                    title="Delete Task"
                    variant="secondary"
                    onPress={handleDeleteTask}
                    disabled={updating}
                  />
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </Container>
  );
}
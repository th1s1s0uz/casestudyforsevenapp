import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { Task } from '@/types';
import { parseTaskName, parseChecklistFromDescription } from '@/utils/taskUtils';
import { NavigationHelpers } from '@/constants/navigation';

interface TaskCardProps {
  task: Task;
  variant?: 'full' | 'simple';
  onDelete?: (taskId: number, taskName: string) => void;
  deleting?: number | null;
  getListName?: (listId: number) => string;
}

export const TaskCard: React.FC<TaskCardProps> = React.memo(({
  task,
  variant = 'full',
  onDelete,
  deleting,
  getListName
}) => {
  const { description, checklist } = parseChecklistFromDescription(task.description);
  const { icon, name } = parseTaskName(task.name);

  if (variant === 'simple') {
    return (
      <Link href={NavigationHelpers.getTaskDetailRoute(task.id) as any} asChild>
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
            <Text className="text-sm text-primary-600">click to view details</Text>
          </View>
        </TouchableOpacity>
      </Link>
    );
  }

  return (
    <View className="bg-glass-card mb-4 rounded-2xl border border-gray-100 overflow-hidden">
      <Link href={NavigationHelpers.getTaskDetailRoute(task.id) as any} asChild>
        <TouchableOpacity 
          className="p-5"
          activeOpacity={0.7}
        >
          <View className="flex-row items-start mb-3">
            <View className="bg-gray-100 w-12 h-12 rounded-xl items-center justify-center mr-4">
              <Text className="text-2xl">{icon}</Text>
            </View>
            <View className="flex-1">
              <Text className={`text-xl font-bold mb-2 ${task.is_completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                {name}
              </Text>
              
              {description && (
                <Text className={`text-sm leading-5 mb-3 ${task.is_completed ? 'text-gray-400' : 'text-gray-600'}`}>
                  {description}
                </Text>
              )}
              
              <View className="flex-row items-center flex-wrap gap-2">
                <View className={`flex-row items-center px-2 py-1 rounded-lg ${
                  task.priority === 'high' ? 'bg-accent-red-100' : 
                  task.priority === 'medium' ? 'bg-accent-orange-100' : 'bg-accent-green-100'
                }`}>
                  <View className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                    task.priority === 'high' ? 'bg-accent-red-500' : 
                    task.priority === 'medium' ? 'bg-accent-orange-500' : 'bg-accent-green-500'
                  }`} />
                  <Text className={`text-xs font-medium capitalize ${
                    task.priority === 'high' ? 'text-accent-red-700' : 
                    task.priority === 'medium' ? 'text-accent-orange-700' : 'text-accent-green-700'
                  }`}>
                    {task.priority || 'medium'}
                  </Text>
                </View>
                
                {checklist.length > 0 && (
                  <View className="bg-primary-100 px-2 py-1 rounded-lg">
                    <Text className="text-xs font-medium text-primary-700">
                      📋 {checklist.length}
                    </Text>
                  </View>
                )}
                
                {getListName && (
                  <View className="bg-gray-100 px-2 py-1 rounded-lg">
                    <Text className="text-xs font-medium text-gray-700">
                      📁 {getListName(task.list_id)}
                    </Text>
                  </View>
                )}
                
                <View className={`px-2 py-1 rounded-lg ${
                  task.is_completed ? 'bg-accent-green-100' : 'bg-accent-orange-100'
                }`}>
                  <Text className={`text-xs font-medium ${
                    task.is_completed ? 'text-accent-green-700' : 'text-accent-orange-700'
                  }`}>
                    {task.is_completed ? '✅ Done' : '⏳ Pending'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
           <Text className="text-xs text-primary-600">
            click to view details
           </Text>
            {onDelete && (
              <TouchableOpacity
                onPress={() => onDelete(task.id, name)}
                disabled={deleting === task.id}
                className="p-2"
              >
                {deleting === task.id ? (
                  <ActivityIndicator size="small" color="#ef4444" />
                ) : (
                  <Text className="text-red-500 text-md">Delete</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
});

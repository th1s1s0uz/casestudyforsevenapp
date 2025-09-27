import React, { useCallback } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';

interface FilterSectionProps {
  filterPriority: 'all' | 'high' | 'medium' | 'low';
  filterStatus: 'all' | 'completed' | 'pending';
  onPriorityFilter: (priority: 'all' | 'high' | 'medium' | 'low') => void;
  onStatusFilter: (status: 'all' | 'completed' | 'pending') => void;
}

export const FilterSection: React.FC<FilterSectionProps> = React.memo(({
  filterPriority,
  filterStatus,
  onPriorityFilter,
  onStatusFilter
}) => {
  const priorityFilters = [
    { key: 'all', label: 'All', color: 'bg-gray-200' },
    { key: 'high', label: 'High', color: 'bg-accent-red-100' },
    { key: 'medium', label: 'Medium', color: 'bg-accent-orange-100' },
    { key: 'low', label: 'Low', color: 'bg-accent-green-100' }
  ] as const;

  const statusFilters = [
    { key: 'all', label: 'All Tasks' },
    { key: 'pending', label: 'Pending' },
    { key: 'completed', label: 'Completed' }
  ] as const;

  const handlePriorityPress = useCallback((priority: 'all' | 'high' | 'medium' | 'low') => {
    onPriorityFilter(priority);
  }, [onPriorityFilter]);

  const handleStatusPress = useCallback((status: 'all' | 'completed' | 'pending') => {
    onStatusFilter(status);
  }, [onStatusFilter]);

  return (
    <View>
      {/* Priority Filter */}
      <View className="mb-4">
        <Text className="text-gray-700 font-semibold mb-3">Priority Filter</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 2 }}
          className="flex-row"
        >
          {priorityFilters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => handlePriorityPress(filter.key)}
              className={`px-4 py-2 rounded-xl border mr-2 ${
                filterPriority === filter.key 
                  ? `${filter.color} border-gray-300` 
                  : 'bg-white border-gray-200'
              }`}
            >
              <Text className={`text-sm font-medium ${
                filterPriority === filter.key ? 'text-gray-900' : 'text-gray-600'
              }`}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Status Filter */}
      <View className="mb-6">
        <Text className="text-gray-700 font-semibold mb-3">Status Filter</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 2 }}
          className="flex-row"
        >
          {statusFilters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => handleStatusPress(filter.key)}
              className={`px-4 py-2 rounded-xl border mr-2 ${
                filterStatus === filter.key 
                  ? 'bg-primary-100 border-primary-300' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <Text className={`text-sm font-medium ${
                filterStatus === filter.key ? 'text-primary-900' : 'text-gray-600'
              }`}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
});

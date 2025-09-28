import React, { useCallback, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Animated } from 'react-native';

interface List {
  id: number;
  name: string;
}

interface FilterSectionProps {
  filterPriority: 'all' | 'high' | 'medium' | 'low';
  filterStatus: 'all' | 'completed' | 'pending';
  filterList: number | 'all';
  lists: List[];
  onPriorityFilter: (priority: 'all' | 'high' | 'medium' | 'low') => void;
  onStatusFilter: (status: 'all' | 'completed' | 'pending') => void;
  onListFilter: (listId: number | 'all') => void;
  isExpanded: boolean;
  onToggleAccordion: () => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  filterPriority,
  filterStatus,
  filterList,
  lists,
  onPriorityFilter,
  onStatusFilter,
  onListFilter,
  isExpanded,
  onToggleAccordion
}) => {
  const [animation] = useState(new Animated.Value(0));

  React.useEffect(() => {
    const toValue = isExpanded ? 1 : 0;
    
    Animated.timing(animation, {
      toValue,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [isExpanded, animation]);
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

  const handleListPress = useCallback((listId: number | 'all') => {
    onListFilter(listId);
  }, [onListFilter]);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filterPriority !== 'all') count++;
    if (filterStatus !== 'all') count++;
    if (filterList !== 'all') count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  const rotateIcon = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View className="bg-white rounded-2xl border border-gray-200 mb-6">
      <TouchableOpacity
        onPress={onToggleAccordion}
        className="p-4 flex-row items-center justify-between"
      >
        <View className="flex-row items-center">
          <Text className="text-gray-600 font-semibold text-md">Filters</Text>
          {activeFiltersCount > 0 && (
            <View className="ml-2 bg-primary-100 rounded-full px-2 py-1">
              <Text className="text-primary-900 text-xs font-medium">
                {activeFiltersCount}
              </Text>
            </View>
          )}
        </View>
        <Animated.View style={{ transform: [{ rotate: rotateIcon }] }}>
          <Text className="text-gray-500 text-xl">▼</Text>
        </Animated.View>
      </TouchableOpacity>

      <Animated.View
        style={{
          maxHeight: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 400],
          }),
          opacity: animation,
        }}
      >
        <View className="px-4 pb-4">
          <View className="mb-4">
            <Text className="text-gray-500 font-semibold mb-3">Priority Filter</Text>
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

          <View className="mb-4">
            <Text className="text-gray-500 font-semibold mb-3">Status Filter</Text>
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

          <View className="mb-2">
            <Text className="text-gray-500 font-semibold mb-3">List Filter</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 2 }}
              className="flex-row"
            >
              <TouchableOpacity
                onPress={() => handleListPress('all')}
                className={`px-4 py-2 rounded-xl border mr-2 ${
                  filterList === 'all' 
                    ? 'bg-primary-100 border-primary-300' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <Text className={`text-sm font-medium ${
                  filterList === 'all' ? 'text-primary-900' : 'text-gray-600'
                }`}>
                  All Lists
                </Text>
              </TouchableOpacity>
              {lists.map((list) => (
                <TouchableOpacity
                  key={list.id}
                  onPress={() => handleListPress(list.id)}
                  className={`px-4 py-2 rounded-xl border mr-2 ${
                    filterList === list.id 
                      ? 'bg-primary-100 border-primary-300' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <Text className={`text-sm font-medium ${
                    filterList === list.id ? 'text-primary-900' : 'text-gray-600'
                  }`}>
                    {list.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

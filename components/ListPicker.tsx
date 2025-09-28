import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, TextInput } from 'react-native';
import { useListStore } from '@/store/listStore';

interface ListPickerProps {
  selectedListId: number | null;
  onListSelect: (listId: number) => void;
  placeholder?: string;
  className?: string;
}

export const ListPicker: React.FC<ListPickerProps> = ({
  selectedListId,
  onListSelect,
  placeholder = "Select a list",
  className = ""
}) => {
  const { lists, loading, fetchLists, createList } = useListStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    if (lists.length === 0) {
      fetchLists();
    }
  }, []);

  const selectedList = lists.find(list => list.id === selectedListId);

  const handleCreateList = async () => {
    if (newListName.trim()) {
      await createList(newListName.trim());
      setNewListName('');
    }
  };

  const handleListSelect = (listId: number) => {
    onListSelect(listId);
    setIsModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        className={`p-4 bg-white rounded-xl border border-gray-200 ${className}`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-sm text-gray-500 mb-1">List</Text>
            <Text className={`text-base ${selectedList ? 'text-gray-900' : 'text-gray-400'}`}>
              {selectedList ? selectedList.name : placeholder}
            </Text>
          </View>
          <Text className="text-gray-400 text-lg">▼</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-primary-50">
          <View className="p-6 border-b border-gray-200 bg-white">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-900">Select List</Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                className="p-2"
              >
                <Text className="text-lg text-gray-500">✕</Text>
              </TouchableOpacity>
            </View>

            {/* Create new list */}
            <View className="flex-row gap-3 mb-4">
              <TextInput
                value={newListName}
                onChangeText={setNewListName}
                placeholder="New list name"
                className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200"
                onSubmitEditing={handleCreateList}
              />
              <TouchableOpacity
                onPress={handleCreateList}
                className="px-4 py-3 bg-accent-green-500 rounded-lg"
                disabled={!newListName.trim()}
              >
                <Text className="text-white font-medium">Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={lists}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleListSelect(item.id)}
                className={`p-4 border-b border-gray-100 ${
                  selectedListId === item.id ? 'bg-accent-green-50' : 'bg-white'
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <Text className={`text-base ${
                    selectedListId === item.id ? 'text-accent-green-700 font-medium' : 'text-gray-900'
                  }`}>
                    {item.name}
                  </Text>
                  {selectedListId === item.id && (
                    <Text className="text-accent-green-500 text-lg">✓</Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View className="p-8 items-center">
                <Text className="text-gray-500 text-center">
                  {loading ? 'Loading lists...' : 'No lists found. Create one above!'}
                </Text>
              </View>
            }
          />
        </View>
      </Modal>
    </>
  );
};

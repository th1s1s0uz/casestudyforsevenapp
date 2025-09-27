import React, { useCallback, useState, useEffect } from 'react';
import { TextInput, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = React.memo(({
  value,
  onChangeText,
  placeholder = "Search...",
  onClear,
  className = ""
}) => {
  const [internalValue, setInternalValue] = useState(value);

  // Sync internal value with external value
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleTextChange = useCallback((text: string) => {
    setInternalValue(text);
    onChangeText(text);
  }, [onChangeText]);

  const handleClear = useCallback(() => {
    setInternalValue('');
    if (onClear) {
      onClear();
    }
  }, [onClear]);
  return (
    <View className={`flex-row items-center bg-white rounded-2xl border border-gray-200 px-4 py-3 ${className}`}>
      <Ionicons name="search" size={20} color="#6b7280" />
      <TextInput
        value={internalValue}
        onChangeText={handleTextChange}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        className="flex-1 ml-3 text-gray-900 text-start"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {internalValue.length > 0 && onClear && (
        <TouchableOpacity
          onPress={handleClear}
          className="ml-2"
          activeOpacity={0.7}
        >
          <Ionicons name="close-circle" size={20} color="#6b7280" />
        </TouchableOpacity>
      )}
    </View>
  );
});

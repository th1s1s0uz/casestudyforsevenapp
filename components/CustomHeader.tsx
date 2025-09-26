import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface CustomHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  subtitle,
  showBackButton = true,
  rightComponent,
  backgroundColor = 'bg-white',
  textColor = '#1f2937'
}) => {
  const router = useRouter();

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <>
      <View 
        className="px-6 pt-4 pb-4 border-b border-gray-100"
        style={{ backgroundColor }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            {showBackButton && (
              <TouchableOpacity
                onPress={handleBackPress}
                className="mr-4 p-2 rounded-xl bg-white/80 border border-gray-200"
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-back" size={20} color={textColor} />
              </TouchableOpacity>
            )}
            
            <View className="flex-1">
              <Text 
                className="text-2xl font-bold"
                style={{ color: textColor }}
                numberOfLines={1}
              >
                {title}
              </Text>
              {subtitle && (
                <Text 
                  className="text-sm mt-1 opacity-70"
                  style={{ color: textColor }}
                  numberOfLines={1}
                >
                  {subtitle}
                </Text>
              )}
            </View>
          </View>

          {rightComponent && (
            <View className="ml-4">
              {rightComponent}
            </View>
          )}
        </View>
      </View>
    </>
  );
};

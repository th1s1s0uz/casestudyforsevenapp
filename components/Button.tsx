import { forwardRef } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

type ButtonProps = {
  title: string;
  variant?: ButtonVariant;
  onPress?: () => void;
} & Omit<TouchableOpacityProps, 'onPress'>;

export const Button = forwardRef<View, ButtonProps>(({ 
  title, 
  variant = 'primary', 
  onPress,
  className,
  ...touchableProps 
}, ref) => {
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-secondary-400 border border-secondary-400';
      case 'secondary':
        return 'bg-white border border-secondary-400';
      case 'tertiary':
        return 'bg-gray-500 border-gray-500';
      default:
        return 'bg-primary-500 border-primary-500';
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'primary':
        return 'text-white text-lg font-semibold text-center';
      case 'secondary':
        return 'text-secondary-400 text-lg font-semibold text-center';
      case 'tertiary':
        return 'text-white text-lg font-semibold text-center';
      default:
        return 'text-white text-lg font-semibold text-center';
    }
  };

  return (
    <TouchableOpacity
      ref={ref}
      onPress={onPress}
      {...touchableProps}
      className={`items-center rounded-2xl border-2 p-4 ${getButtonStyles()} ${className || ''}`}
      activeOpacity={0.8}
    >
      <Text className={getTextStyles()}>{title}</Text>
    </TouchableOpacity>
  );
});

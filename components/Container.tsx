import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { CustomHeader } from './CustomHeader';

interface ContainerProps {
  children: React.ReactNode;
  showHeader?: boolean;
  headerTitle?: string;
  headerSubtitle?: string;
  headerRightComponent?: React.ReactNode;
  headerShowBackButton?: boolean;
}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  showHeader = false,
  headerTitle = '',
  headerSubtitle,
  headerRightComponent,
  headerShowBackButton = true
}) => {
  return (
    <SafeAreaView className={styles.container}>
      {showHeader && (
        <CustomHeader
          title={headerTitle}
          subtitle={headerSubtitle}
          showBackButton={headerShowBackButton}
          rightComponent={headerRightComponent}
        />
      )}
      <View className="flex-1">
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = {
  container: 'flex flex-1',
};

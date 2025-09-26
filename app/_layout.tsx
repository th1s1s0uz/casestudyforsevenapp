import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import DatabaseProvider from '@/providers/database-provider';

export default function Layout() {
  return (
    <DatabaseProvider>
      <StatusBar 
        style="dark" 
        backgroundColor="#eff6ff" 
        translucent={false}
      />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      />
    </DatabaseProvider>
  );
}

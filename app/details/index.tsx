import { Stack, useLocalSearchParams } from 'expo-router';

import { Container } from '@/components/Container';
import { ScreenContent } from '@/components/ScreenContent';
import { ScreenTitles } from '@/constants/navigation';

export default function Details() {
  const { name } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ title: ScreenTitles.DETAILS }} />
      <Container>
        <ScreenContent path="app/details.tsx" title={`Showing details for user ${name}`} />
      </Container>
    </>
  );
}

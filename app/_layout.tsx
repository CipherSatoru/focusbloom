import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useStore } from '@/store';
import { getStartOfToday } from '@/utils/dateHelpers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const resetDailyUnlocks = useStore((state) => state.resetDailyEmergencyUnlocks);
  const lastReset = useStore((state) => state.settings.lastEmergencyReset);

  // Reset emergency unlocks at midnight
  useEffect(() => {
    const now = Date.now();
    const todayStart = getStartOfToday();

    if (!lastReset || lastReset < todayStart) {
      resetDailyUnlocks();
      useStore.getState().updateSettings({
        lastEmergencyReset: now,
      });
    }

    // Set up midnight reset
    const hoursUntilMidnight = 24 - new Date().getHours();
    const msUntilMidnight = hoursUntilMidnight * 60 * 60 * 1000;

    const timer = setTimeout(() => {
      resetDailyUnlocks();
      useStore.getState().updateSettings({
        lastEmergencyReset: Date.now(),
      });
    }, msUntilMidnight);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: 'Georgia',
          fontSize: 18,
          fontWeight: '700',
        },
        animation: 'slide_from_right',
      }}
    >
      {children}
    </Stack>
  );
}

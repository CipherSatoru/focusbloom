import { ExpoRoot } from 'expo-router';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

export default function App() {
  const colorScheme = useColorScheme();

  // Load the Expo Router context
  const ctx = require.context('./app');

  return (
    <ThemeProvider>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <ExpoRoot context={ctx} />
    </ThemeProvider>
  );
}

import { Stack } from 'expo-router';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { I18nManager } from 'react-native';
import { useStore } from '../store/useStore';
import { en, fa } from '../utils/translations';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1565C0', // Deep Blue
    secondary: '#FFA000', // Amber
    background: '#F5F5F7',
    surface: '#ffffff',
    error: '#B00020',
  },
  roundness: 12,
};

export default function Layout() {
  const language = useStore(state => state.language);
  const t = language === 'fa' ? fa : en;
  
  const [fontsLoaded] = useFonts({
    // Load custom fonts if any, or just ensure Expo system is ready
  });

  useEffect(() => {
    // Handle RTL if Persian
    // For simple app, we can just use direction in styles, but React Native has I18nManager
    // Flipping I18nManager requires reload, so we might key UI updates on language
  }, [language]);

  if (!fontsLoaded && false) { 
      // return null or splash screen
      // "false" condition because useFonts returns false initially even if no fonts provided, 
      // but here we just want to ensure hooks are run.
      // If we had actual font files, we'd wait.
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTintColor: '#000',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            contentStyle: {
                direction: language === 'fa' ? 'rtl' : 'ltr'
            }
          }}
        >
          <Stack.Screen name="index" options={{ title: t.my_garage }} />
          <Stack.Screen name="add-car" options={{ title: t.add_new_car }} />
          <Stack.Screen name="car/[id]" options={{ title: t.car_details }} />
          <Stack.Screen name="history/[id]" options={{ title: t.service_history }} />
          <Stack.Screen name="service/add" options={{ title: t.log_service }} />
          <Stack.Screen name="service/[serviceId]" options={{ title: t.service_details }} />
          <Stack.Screen name="service/edit/[id]" options={{ title: t.update_record }} />
        </Stack>
      </PaperProvider>
    </SafeAreaProvider>
  );
}


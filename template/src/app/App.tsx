import { StatusBar } from 'react-native';
import { AppProviders } from './providers';
import { RootNavigator } from './navigation/root';
import '@/i18n';
import Toast from 'react-native-toast-message';
import { useAppTheme } from '@/context/ThemeContext';
import { toastConfig } from '@/services/toast';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  const { theme, mode } = useAppTheme();
  const isDark = mode === 'dark';

  return (
    <GestureHandlerRootView>
      <AppProviders>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <RootNavigator />
        <Toast config={toastConfig} />
      </AppProviders>
    </GestureHandlerRootView>
  );
};

export default App;

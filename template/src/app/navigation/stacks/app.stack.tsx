import { useAppTheme } from '@/context/ThemeContext';
import MainTabs from '@/screens/app/main-tab';
import ProfileSetup from '@/screens/app/profile-setup';
import { FontFamily } from '@/theme';
import { layout } from '@/theme/layout';
import { AppStackParamList } from '@/types';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppBottomTabs from './app.tab';
import { useAppSelector } from '@/hooks/useAppSelector';
import { StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => {
  const { color } = useAppTheme();
  const { isProfileSetup } = useAppSelector(state => state.user);
  return (
    <Stack.Navigator
      initialRouteName={isProfileSetup ? 'BottomTabs' : 'ProfileSetup'}
      screenOptions={{
        headerTitleAlign: 'center',
        headerShown: true,
        headerTitleStyle: [
          styles.headerTitle,
          { color: color.text_primary },
        ],
        contentStyle: [
          { backgroundColor: color.background_primary },
          layout.flex,
        ],
        headerStyle: { backgroundColor: color.background_secondary },
        headerBackVisible: false,
        animation: 'slide_from_right',
        // headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="ProfileSetup"
        component={ProfileSetup}
        options={{
          headerTitle: 'Profile Setup',
        }}
      />
      <Stack.Screen
        component={AppBottomTabs}
        name="BottomTabs"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{
          headerTitle: 'Main Tab',
        }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;

const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: FontFamily.InterTightMedium,
    fontSize: 20,
  },
});

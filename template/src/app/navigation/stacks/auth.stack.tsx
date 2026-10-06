import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ForgotPassword, Login, Signup } from '@/screens/auth';
import HeaderBackButton from '@/components/shared/navigation/HeaderBackButton';
import { FontFamily } from '@/theme';
import { useAppTheme } from '@/context/ThemeContext';
import { layout } from '@/theme/layout';
import { AuthStackParamList } from '@/types';
import { StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  const { color } = useAppTheme();
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        contentStyle: [
          { backgroundColor: color.background_primary },
          layout.flex,
        ],
        headerStyle: { backgroundColor: color.background_secondary },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />

      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Forgot Password?',
          headerTitleAlign: 'center',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => <HeaderBackButton onPress={navigation.goBack} />,
          headerTitleStyle: [
            styles.headerTitle,
            { color: color.text_primary },
          ],
        })}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;

const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: FontFamily.InterTightMedium,
    fontSize: 20,
  },
});

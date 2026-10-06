import {
  renderHomeIcon,
  renderProfileIcon,
} from '@/components/shared/navigation/tabIconRender';
import { useAppTheme } from '@/context/ThemeContext';
import { Home, Profile } from '@/screens/tab';
import { FontFamily } from '@/theme';
import { layout } from '@/theme/layout';
import { BottomTabParamList } from '@/types';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet } from 'react-native';

const Tabs = createBottomTabNavigator<BottomTabParamList>();

const AppBottomTabs = () => {
  const { color } = useAppTheme();

  return (
    <Tabs.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTitleAlign: 'center',
        headerShown: false,
        headerTitleStyle: [styles.tabbarHeaderTitle,{ color: color.text_primary,}],
        sceneStyle: [
          { backgroundColor: color.background_primary },
          layout.flex,
        ],
        headerStyle: { backgroundColor: color.background_secondary },
        tabBarStyle: [styles.tabbarStyle, {backgroundColor: color.background_secondary}],
        tabBarButton: ({ ref: _ref, ...props }) => <Pressable {...props} android_ripple={{color:'transparent',foreground:true}} />,
        tabBarAllowFontScaling: false,
        tabBarActiveTintColor: color.secondary,
        tabBarInactiveTintColor: color.text_secondary,
        tabBarLabelStyle: styles.tabbarLabel
      }}
    >
      <Tabs.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: renderHomeIcon,
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: renderProfileIcon,
        }}
      />
    </Tabs.Navigator>
  );
};

export default AppBottomTabs;


const styles = StyleSheet.create({
  tabbarStyle: {
    height: 80,
    paddingTop: 8,
  },
  tabbarLabel:{
    fontFamily: FontFamily.InterTightRegular,
    fontSize: 12,
  },
  tabbarHeaderTitle:{
   fontFamily: FontFamily.InterTightMedium,
    fontSize: 20,
  }
})
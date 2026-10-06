import { useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { NavigationContext } from '@react-navigation/native';

/**
 * False while the app is backgrounded or the hosting screen is unfocused (e.g. another
 * tab), so looping animations can stop instead of burning frames off-screen.
 * Reads the navigation context directly so it also works outside a navigator.
 */
export const useWifiIconAnimationActive = () => {
  const navigation = useContext(NavigationContext);
  const [focused, setFocused] = useState(() => navigation?.isFocused() ?? true);
  const [foreground, setForeground] = useState(
    AppState.currentState !== 'background',
  );

  useEffect(() => {
    if (!navigation) {
      return;
    }
    const offFocus = navigation.addListener('focus', () => setFocused(true));
    const offBlur = navigation.addListener('blur', () => setFocused(false));
    return () => {
      offFocus();
      offBlur();
    };
  }, [navigation]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state =>
      setForeground(state === 'active'),
    );
    return () => subscription.remove();
  }, []);

  return focused && foreground;
};

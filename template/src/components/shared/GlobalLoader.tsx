import { useAppTheme } from '@/context/ThemeContext';
import { useAppSelector } from '@/hooks/useAppSelector';
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';

const GlobalLoader = () => {
  const isLoading = useAppSelector(state => state.loader.isLoading);
  const { color } = useAppTheme();

  return (
    <Modal transparent visible={isLoading} statusBarTranslucent>
      <View style={styles.container}>
        <View
          style={[
            styles.loaderBox,
            { backgroundColor: color.background_secondary },
          ]}
        >
          <ActivityIndicator size="large" color={color.primary} />
        </View>
      </View>
    </Modal>
  );
};

export default GlobalLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderBox: {
    width: 70,
    height: 70,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

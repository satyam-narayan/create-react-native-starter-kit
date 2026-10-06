import { Pressable, StyleSheet } from 'react-native';
import { memo } from 'react';
import AppImage from '../AppImage';
import { GlobalImage } from '@/assets/images';
import { useAppTheme } from '@/context/ThemeContext';

const HeaderBackButton = ({ onPress }: { onPress: () => void }) => {
  const { color } = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      hitSlop={20}
      android_ripple={{ color: 'rgba(0,0,0,0.15)', borderless: true }}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.6 : 1,
        },
        styles.iconCont,
      ]}
    >
      <AppImage
        source={GlobalImage.back}
        style={styles.backIcon}
        tintColor={color.text_primary}
      />
    </Pressable>
  );
};

export default memo(HeaderBackButton);

const styles = StyleSheet.create({
  iconCont: {
    width: 22,
    height: 22,
  },
  backIcon: { width: '100%', height: '100%' },
});

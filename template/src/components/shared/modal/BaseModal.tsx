import React, { memo, ReactNode } from 'react';
import {
  Modal,
  ModalProps,
  Pressable,
  StyleSheet,
  ViewProps,
} from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { palette } from '@/theme';

interface Props extends Partial<Omit<ModalProps, 'visible' | 'children'>> {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  overlayStyle?: ViewProps['style'];
  contentStyle?: ViewProps['style'];
  disableOverlayPress?: boolean;
}

const BaseModal = ({
  isOpen,
  onClose,
  children,
  overlayStyle,
  contentStyle,
  disableOverlayPress = false,
  ...rest
}: Props) => {
  const { color } = useAppTheme();

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="fade"
      presentationStyle="overFullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
      {...rest}
    >
      <Pressable
        style={[styles.overlay, overlayStyle]}
        disabled={disableOverlayPress}
        onPress={onClose}
      >
        <Pressable
          style={[
            styles.content,
            { backgroundColor: color.background_primary },
            contentStyle,
          ]}
        >
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default memo(BaseModal);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  content: {
    width: '100%',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    shadowColor: palette.black[900],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
  },
});

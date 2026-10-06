import React, {
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { IconName } from '@/assets/icons';
import Icon from '@/components/shared/Icon';
import CustomText from '@/components/shared/text/CustomText';
import { useAppTheme } from '@/context/ThemeContext';
import { ColorType, spacing } from '@/theme';
import { normalize } from '@/utils/normalize';
import BaseBottomSheetModal from '../BaseBottomSheetModal';
import { BSRef } from '../types';

interface Props {
  onCamera: () => void;
  onGallery: () => void;
  /** When true, uses document-upload copy (images, PDF, etc.). */
  canDocUpload?: boolean;
}

const OPEN_PICKER_DELAY_MS = 300;

type SourceOption = {
  id: 'camera' | 'gallery';
  icon: IconName;
  photoLabelKey: 'imagePicker.camera' | 'imagePicker.gallery';
  photoHintKey: 'imagePicker.cameraHint' | 'imagePicker.galleryHint';
  docLabelKey: 'imagePicker.docCamera' | 'imagePicker.docGallery';
  docHintKey: 'imagePicker.docCameraHint' | 'imagePicker.docGalleryHint';
};

const SOURCE_OPTIONS: SourceOption[] = [
  {
    id: 'camera',
    icon: 'claim_upload',
    photoLabelKey: 'imagePicker.camera',
    photoHintKey: 'imagePicker.cameraHint',
    docLabelKey: 'imagePicker.docCamera',
    docHintKey: 'imagePicker.docCameraHint',
  },
  {
    id: 'gallery',
    icon: 'folder',
    photoLabelKey: 'imagePicker.gallery',
    photoHintKey: 'imagePicker.galleryHint',
    docLabelKey: 'imagePicker.docGallery',
    docHintKey: 'imagePicker.docGalleryHint',
  },
];

const ImagePickerSheet = forwardRef<BSRef, Props>(
  ({ onCamera, onGallery, canDocUpload = false }, ref) => {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const { color } = useAppTheme();
    const styles = useMemo(() => makeStyles(color), [color]);
    const sheetRef = useRef<BottomSheetModal>(null);
    const pendingActionRef = useRef<(() => void) | null>(null);

    const titleKey = canDocUpload
      ? 'imagePicker.docTitle'
      : 'imagePicker.title';
    const subtitleKey = canDocUpload
      ? 'imagePicker.docSubtitle'
      : 'imagePicker.subtitle';

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.present(),
      close: () => sheetRef.current?.dismiss(),
    }));

    const runAfterClose = useCallback((action: () => void) => {
      pendingActionRef.current = action;
      sheetRef.current?.dismiss();
    }, []);

    const handleDismiss = useCallback(() => {
      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      if (!action) return;
      setTimeout(action, OPEN_PICKER_DELAY_MS);
    }, []);

    const handleCamera = useCallback(() => {
      runAfterClose(onCamera);
    }, [onCamera, runAfterClose]);

    const handleGallery = useCallback(() => {
      runAfterClose(onGallery);
    }, [onGallery, runAfterClose]);

    const handleCancel = useCallback(() => {
      sheetRef.current?.dismiss();
    }, []);

    const handleOptionPress = useCallback(
      (id: SourceOption['id']) => {
        if (id === 'camera') {
          handleCamera();
          return;
        }
        handleGallery();
      },
      [handleCamera, handleGallery],
    );

    return (
      <BaseBottomSheetModal
        ref={sheetRef}
        enableDynamicSizing
        enablePanDownToClose
        onDismiss={handleDismiss}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetView
          style={[
            styles.content,
            { paddingBottom: Math.max(insets.bottom, spacing.md) },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <CustomText
                variant="titleSm"
                weight="700"
                textColor={color.text_heading}
                style={styles.title}
              >
                {t(titleKey)}
              </CustomText>
              <Pressable
                onPress={handleCancel}
                hitSlop={12}
                style={({ pressed }) => [
                  styles.cancelHit,
                  pressed && styles.cancelPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={t('common.cancel')}
              >
                <CustomText
                  variant="label"
                  weight="600"
                  textColor={color.danger_strong}
                  style={styles.cancelLabel}
                >
                  {t('common.cancel')}
                </CustomText>
              </Pressable>
            </View>
            <CustomText
              variant="label"
              weight="400"
              textColor={color.text_secondary}
              style={styles.subtitle}
            >
              {t(subtitleKey)}
            </CustomText>
          </View>

          <View style={styles.options}>
            {SOURCE_OPTIONS.map(option => {
              const labelKey = canDocUpload
                ? option.docLabelKey
                : option.photoLabelKey;
              const hintKey = canDocUpload
                ? option.docHintKey
                : option.photoHintKey;

              return (
              <Pressable
                key={option.id}
                onPress={() => handleOptionPress(option.id)}
                style={({ pressed }) => [
                  styles.optionCard,
                  pressed && styles.optionPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={t(labelKey)}
              >
                <View style={styles.optionIconTile}>
                  <Icon name={option.icon} width={20} height={20} />
                </View>
                <View style={styles.optionCopy}>
                  <CustomText
                    variant="label"
                    weight="700"
                    textColor={color.text_heading}
                    style={styles.optionLabel}
                  >
                    {t(labelKey)}
                  </CustomText>
                  <CustomText
                    variant="caption"
                    weight="400"
                    textColor={color.text_subtle}
                    style={styles.optionHint}
                  >
                    {t(hintKey)}
                  </CustomText>
                </View>
              </Pressable>
              );
            })}
          </View>
        </BottomSheetView>
      </BaseBottomSheetModal>
    );
  },
);

export default React.memo(ImagePickerSheet);

const makeStyles = (color: ColorType) =>
  StyleSheet.create({
    sheetBackground: {
      backgroundColor: color.background_primary,
      borderTopLeftRadius: normalize(24),
      borderTopRightRadius: normalize(24),
    },
    handleIndicator: {
      width: normalize(40),
      height: normalize(4),
      borderRadius: 999,
      backgroundColor: color.border,
    },
    content: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.xs,
    },
    header: {
      marginBottom: spacing.md,
      gap: 6,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    title: {
      marginBottom: 0,
      flex: 1,
    },
    cancelHit: {
      paddingVertical: 2,
      paddingLeft: 8,
    },
    cancelLabel: {
      marginBottom: 0,
    },
    cancelPressed: {
      opacity: 0.7,
    },
    subtitle: {
      marginBottom: 0,
      lineHeight: normalize(20),
    },
    options: {
      gap: 10,
      marginBottom: spacing.xs,
    },
    optionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      minHeight: normalize(72),
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 2,
      borderRadius: normalize(16),
      backgroundColor: color.background_soft,
      borderWidth: 1,
      borderColor: color.border,
      overflow: 'hidden',
    },
    optionPressed: {
      opacity: 0.88,
      transform: [{ scale: 0.98 }],
    },
    optionIconTile: {
      width: normalize(44),
      height: normalize(44),
      borderRadius: normalize(14),
      backgroundColor: color.secondary_muted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionCopy: {
      flex: 1,
      gap: 2,
      minWidth: 0,
    },
    optionLabel: {
      marginBottom: 0,
    },
    optionHint: {
      marginBottom: 0,
    },
  });

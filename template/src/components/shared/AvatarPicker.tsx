import React, { useState, useCallback, useEffect, useRef, memo } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import AppImage from './AppImage';
import { GlobalImage } from '@/assets/images';
import Icon from './Icon';
import { useAppTheme } from '@/context/ThemeContext';
import { isIOS } from '@/constants/device';
import { useImagePicker } from '@/hooks/useImagePicker';
import ImagePickerSheet from './bottom-sheet/sheets/ImagePickerSheet';
import { BSRef } from './bottom-sheet/types';
import BaseSkelton from './skelton/BaseSkelton';
import { avatarPickerLayout } from './skelton/layouts';

type SourceType = 'gallery' | 'camera' | 'both';

interface Props {
  imageUrl?: string;
  defaultImage?: any;
  width?: number;
  height?: number;
  alignSelf?: ViewStyle['alignSelf'];
  containerStyle?: ViewStyle;
  editable?: boolean;
  editIconSize?: number;
  isLoading?: boolean;

  source?: SourceType;
  maxSize?: number;
  quality?: number;
  onImageChange?: (image: string) => void;
}

const AvatarPicker = ({
  imageUrl,
  defaultImage = GlobalImage.profilePlaceholder,
  width = 100,
  height = 100,
  alignSelf = 'center',
  containerStyle,
  editable = false,
  editIconSize = 28,
  isLoading,
  source = 'both',
  maxSize = 256,
  quality = 80,
  onImageChange,
}: Props) => {
  const { color } = useAppTheme();
  const { captureFromCamera, images, pickFromGallery } = useImagePicker({
    maxSize,
    quality,
  });
  const [localImageUri, setLocalImageUri] = useState<string | undefined>(
    imageUrl,
  );
  const imageSource = localImageUri ? { uri: localImageUri } : defaultImage;
  const sheetRef = useRef<BSRef>(null);

  useEffect(() => {
    if (images?.length > 0) {
      const image = images[0];

      setLocalImageUri(image.uri);
      onImageChange?.(image.uri);
    }
  }, [images, onImageChange]);

  useEffect(() => {
    setLocalImageUri(imageUrl);
  }, [imageUrl]);

  const dynamicContainerStyle: ViewStyle = {
    width,
    height,
    borderRadius: width / 2,
    alignSelf,
  };

  // Main press handler
  const handleEditPress = useCallback(() => {
    if (source === 'both') {
      sheetRef.current?.open();
    } else if (source === 'camera') {
      captureFromCamera();
    } else {
      pickFromGallery();
    }
  }, [source, captureFromCamera, pickFromGallery]);

  return (
    <>
      <BaseSkelton
        isLoading={isLoading}
        layout={avatarPickerLayout({
          size: width,
        })}
        containerStyle={[
          styles.container,
          dynamicContainerStyle,
          containerStyle,
        ]}
      >
        <View
          style={[
            styles.imageContainer,
            { borderRadius: width / 2, borderColor: color.border },
          ]}
        >
          <AppImage
            source={imageSource}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {editable && (
          <Pressable
            onPress={handleEditPress}
            style={({ pressed }) => [
              styles.editIconContainer,
              pressed && isIOS && { opacity: 0.7 },
              {
                width: editIconSize,
                height: editIconSize,
                borderRadius: editIconSize / 2,
                backgroundColor: color.primary,
                borderColor: color.background_secondary,
              },
            ]}
            android_ripple={{
              color: 'rgba(255,255,255,0.2)',
              borderless: true,
              foreground: true,
            }}
          >
            <Icon name="edit" size={14} />
          </Pressable>
        )}
      </BaseSkelton>
      <ImagePickerSheet
        ref={sheetRef}
        onCamera={captureFromCamera}
        onGallery={pickFromGallery}
      />
    </>
  );
};

export default memo(AvatarPicker);

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  imageContainer: {
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    borderWidth: 0.5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    borderWidth: 2,
    overflow: 'hidden',
  },
});

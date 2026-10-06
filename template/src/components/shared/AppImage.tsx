import React, { memo, useCallback, useMemo, useState } from 'react';
import FastImage, {
  FastImageProps,
  OnErrorEvent,
  type ImageStyle as FastImageStyle,
} from '@d11/react-native-fast-image';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import type { IconName } from '@/assets/icons';
import { GlobalImage } from '@/assets/images';
import CustomText from '@/components/shared/text/CustomText';
import Icon from '@/components/shared/Icon';
import { useAppTheme } from '@/context/ThemeContext';
import { getInitials } from '@/utils/getInitials';

interface AppImageProps extends Omit<FastImageProps, 'style' | 'source'> {
  showLoader?: boolean;
  /** Applied to the outer View wrapper, not FastImage itself. */
  style?: StyleProp<ViewStyle>;
  source?: FastImageProps['source'];
  /** When present and loads successfully → show image. */
  imageUrl?: string | null;
  /** When provided (and no image / image error, and no icon) → initials. */
  name?: string | null;
  /** When provided (and no image / image error) → icon. */
  icon?: IconName;
  iconSize?: number;
  iconStyle?: StyleProp<ViewStyle>;
  /** Last fallback when no image, icon, or name. */
  placeholder?: FastImageProps['source'];
}

const FILL = StyleSheet.absoluteFill as FastImageStyle;

const hasImageUrl = (url?: string | null) => !!url?.trim();

const AppImage = memo(
  ({
    resizeMode = FastImage.resizeMode.contain,
    showLoader = false,
    style,
    onLoadStart,
    onLoadEnd,
    onError,
    source,
    imageUrl,
    name,
    icon,
    iconSize = 24,
    iconStyle,
    placeholder = GlobalImage.profilePlaceholder,
    ...rest
  }: AppImageProps) => {
    const { color } = useAppTheme();
    const [loading, setLoading] = useState(false);
    const [failedSource, setFailedSource] =
      useState<FastImageProps['source']>(undefined);

    const initials = useMemo(() => getInitials(name), [name]);

    const resolvedSource = useMemo(() => {
      if (hasImageUrl(imageUrl)) {
        return { uri: imageUrl!.trim() };
      }
      return source;
    }, [imageUrl, source]);

    const hasError =
      failedSource !== undefined &&
      JSON.stringify(failedSource) === JSON.stringify(resolvedSource);

    const canShowImage = !!resolvedSource && !hasError;

    const handleLoadStart = useCallback(() => {
      setLoading(true);
      onLoadStart?.();
    }, [onLoadStart]);

    const handleLoadEnd = useCallback(() => {
      setLoading(false);
      onLoadEnd?.();
    }, [onLoadEnd]);

    const handleError = useCallback(
      (event: OnErrorEvent) => {
        setLoading(false);
        setFailedSource(resolvedSource);
        onError?.(event);
      },
      [onError, resolvedSource],
    );

    if (canShowImage) {
      return (
        <View style={[styles.container, style]}>
          {showLoader && loading && (
            <View style={styles.loader}>
              <ActivityIndicator />
            </View>
          )}

          <FastImage
            {...rest}
            style={FILL}
            resizeMode={resizeMode}
            source={resolvedSource}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            onError={handleError}
          />
        </View>
      );
    }

    if (icon) {
      return (
        <View style={[styles.container, styles.iconContainer, style]}>
          <Icon
            name={icon}
            width={iconSize}
            height={iconSize}
            style={iconStyle}
          />
        </View>
      );
    }

    if (initials) {
      return (
        <View
          style={[
            styles.container,
            styles.initialsContainer,
            { backgroundColor: color.primary },
            style,
          ]}
        >
          <CustomText
            variant="title"
            weight="700"
            textColor={color.text_default}
            style={styles.initialsText}
          >
            {initials}
          </CustomText>
        </View>
      );
    }

    return (
      <View style={[styles.container, style]}>
        <FastImage
          {...rest}
          style={FILL}
          resizeMode={resizeMode}
          source={placeholder}
        />
      </View>
    );
  },
);

export default AppImage;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  initialsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    marginBottom: 0,
  },
  loader: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

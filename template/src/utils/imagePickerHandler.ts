import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import { getCompressedImage } from './imageCompress';
import { ErrorHandler } from '@/services/errors';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type ImageSourceType = 'gallery' | 'camera' | 'both';

interface CompressedImageResult {
  uri: string;
  width: number;
  height: number;
}

interface PickImageOptions {
  /**
   * Source type for image selection
   * - 'gallery': Pick from photo library only
   * - 'camera': Capture from camera only
   * - 'both': Show action sheet to choose (handled by caller)
   */
  source: ImageSourceType;

  /**
   * Allow multiple image selection (only works with 'gallery' source)
   * @default false
   */
  multiple?: boolean;

  /**
   * Maximum dimension (width/height) for resizing
   * @default 256
   */
  maxSize?: number;

  /**
   * Compression quality (0-100)
   * @default 80
   */
  quality?: number;

  /**
   * Maximum number of images to select (0 = unlimited, only for multiple)
   * @default 0
   */
  selectionLimit?: number;
}

interface PickImageResult {
  /** Array of compressed image results */
  images: CompressedImageResult[];
  /** Whether the operation was cancelled */
  cancelled: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Default Options
// ─────────────────────────────────────────────────────────────────────────────

const defaultOptions: Required<Omit<PickImageOptions, 'source'>> = {
  multiple: false,
  maxSize: 256,
  quality: 80,
  selectionLimit: 0,
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Function
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Unified image picker with compression
 *
 * @example
 * // Pick single image from gallery
 * const result = await pickImage({ source: 'gallery' });
 *
 * // Capture from camera
 * const result = await pickImage({ source: 'camera' });
 *
 * // Pick multiple images with custom compression
 * const result = await pickImage({
 *   source: 'gallery',
 *   multiple: true,
 *   maxSize: 512,
 *   quality: 85,
 *   selectionLimit: 5,
 * });
 */
export const pickImage = async (
  options: PickImageOptions,
): Promise<PickImageResult> => {
  const config = { ...defaultOptions, ...options };
  const { source, multiple, maxSize, quality, selectionLimit } = config;

  try {
    // Prepare picker options
    const pickerOptions: CameraOptions & ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: false,
      quality: 1, // Get full quality, we compress manually
      selectionLimit: multiple ? selectionLimit : 1,
    };

    // Launch appropriate picker
    const result =
      source === 'camera'
        ? await launchCamera(pickerOptions)
        : await launchImageLibrary(pickerOptions);

    // Handle cancellation
    if (result.didCancel || !result.assets?.length) {
      return { images: [], cancelled: true };
    }

    // Compress all selected images
    const compressedImages: CompressedImageResult[] = [];

    for (const asset of result.assets) {
      if (!asset.uri) continue;

      const compressed = await getCompressedImage({
        path: asset.uri,
        maxWidth: asset.width ?? maxSize,
        maxHeight: asset.height ?? maxSize,
        maxSize,
        quality,
      });

      if (compressed?.path) {
        compressedImages.push({
          uri: compressed.path,
          width: compressed.width,
          height: compressed.height,
        });
      }
    }

    return {
      images: compressedImages,
      cancelled: false,
    };
  } catch (error) {
    ErrorHandler(error);
    return { images: [], cancelled: false };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Convenience Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pick single image from gallery
 */
export const pickSingleImage = async (
  options?: Partial<Omit<PickImageOptions, 'source' | 'multiple'>>,
): Promise<CompressedImageResult | null> => {
  const result = await pickImage({
    source: 'gallery',
    multiple: false,
    ...options,
  });
  return result.images[0] ?? null;
};

/**
 * Capture image from camera
 */
export const captureImage = async (
  options?: Partial<Omit<PickImageOptions, 'source' | 'multiple'>>,
): Promise<CompressedImageResult | null> => {
  const result = await pickImage({
    source: 'camera',
    multiple: false,
    ...options,
  });
  return result.images[0] ?? null;
};

/**
 * Pick multiple images from gallery
 */
export const pickMultipleImages = async (
  options?: Partial<Omit<PickImageOptions, 'source' | 'multiple'>>,
): Promise<CompressedImageResult[] | null> => {
  const result = await pickImage({
    source: 'gallery',
    multiple: true,
    ...options,
  });
  return result.images.length ? result.images : null;
};

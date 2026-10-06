import ImageResizer, { Response } from '@bam.tech/react-native-image-resizer';
import { isAndroid, isIOS } from '@/constants/device';

export const getCompressedImage = async ({
  path,
  maxWidth = 256,
  maxHeight = 256,
  quality = 80,
  maxSize = 256,
}: {
  path: string;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSize?: number;
}): Promise<Response | null> => {
  const getCalculatedSize = (width: number, height: number) => {
    let ratio = maxSize / width;
    let newWidth = maxSize;
    let newHeight = height * ratio;

    if (newHeight > maxSize) {
      ratio = maxSize / height;
      newHeight = maxSize;
      newWidth = width * ratio;
    }

    return { width: newWidth, height: newHeight };
  };

  let newSize = { width: maxWidth, height: maxHeight };

  if (maxWidth > maxSize || maxHeight > maxSize) {
    newSize = getCalculatedSize(maxWidth, maxHeight);
  }

  try {
    const result = await ImageResizer.createResizedImage(
      path,
      newSize.width,
      newSize.height,
      'JPEG',
      quality,
    );

    if (result?.path) {
      return {
        ...result,
        path: isAndroid ? 'file://' + result.path : result.path,
      };
    }

    return null;
  } catch (err) {
    console.warn('Image compression error:', err);
    return null;
  }
};

export type CompressedUploadFile = {
  uri: string;
  name: string;
  type: 'image/jpeg';
};

/** Compress a local image and shape it for multipart FormData upload. */
export const getCompressedImageForUpload = async (
  path: string,
  options?: { maxSize?: number; quality?: number },
): Promise<CompressedUploadFile | null> => {
  const maxSize = options?.maxSize ?? 256;
  const quality = options?.quality ?? 80;

  const compressed = await getCompressedImage({
    path,
    maxWidth: maxSize,
    maxHeight: maxSize,
    maxSize,
    quality,
  });

  if (!compressed?.path) {
    return null;
  }

  const uri = compressed.path;
  const rawName = uri.split('/').pop() || 'profile.jpg';
  const name = rawName.includes('.')
    ? rawName.replace(/\.\w+$/, '.jpg')
    : `${rawName}.jpg`;

  return {
    uri: isIOS ? uri.replace('file://', '') : uri,
    name,
    type: 'image/jpeg',
  };
};

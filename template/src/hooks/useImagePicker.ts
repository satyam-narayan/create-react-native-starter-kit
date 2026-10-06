import { useState, useCallback, useRef } from 'react';
import { pickImage } from '@/utils/imagePickerHandler';

type ImageResult = {
  uri: string;
  width: number;
  height: number;
};

interface UseImagePickerOptions {
  maxSize?: number;
  quality?: number;

  //For multiple Image select
  multiple?: boolean;
  selectionLimit?: number;
}

export const useImagePicker = (options?: UseImagePickerOptions) => {
  const {
    multiple = false,
    maxSize = 512,
    quality = 80,
    selectionLimit = 0, //0 means unlimited selection
  } = options || {};

  const [images, setImages] = useState<ImageResult[]>([]);
  const isImagePickerOpen = useRef<boolean>(false);

  // ─────────────────────────────────────────────
  // Internal picker handler
  // ─────────────────────────────────────────────
  const handlePick = useCallback(
    async (source: 'camera' | 'gallery') => {
      if (isImagePickerOpen.current) {
        return;
      }
      try {
        isImagePickerOpen.current = true;

        const result = await pickImage({
          source,
          multiple,
          maxSize,
          quality,
          selectionLimit,
        });

        if (!result.cancelled && result.images.length) {
          if (multiple) {
            setImages((prev: ImageResult[]) => [...prev, ...result.images]);
          } else {
            setImages(result.images);
          }
        }
      } finally {
        isImagePickerOpen.current = false;
      }
    },
    [multiple, maxSize, quality, selectionLimit],
  );

  // ─────────────────────────────────────────────
  // Public functions
  // ─────────────────────────────────────────────
  const pickFromGallery = () => handlePick('gallery');

  const captureFromCamera = () => handlePick('camera');

  const removeImage = (uri: string) => {
    setImages((prev: ImageResult[]) => prev.filter(img => img.uri !== uri));
  };

  const resetImages = () => setImages([]);

  return {
    images,
    pickFromGallery,
    captureFromCamera,
    removeImage,
    resetImages,
  };
};

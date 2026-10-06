import { useState, useCallback, useRef } from 'react';
import { pickDocument } from '@/utils/documentPickerHandler';
import { getFileNameFromUri } from '@/utils/getFileNameFromUri';
import { pickImage } from '@/utils/imagePickerHandler';

export type PickedFile = {
  uri: string;
  name?: string;
  type?: string | null;
  width?: number;
  height?: number;
};

interface UseDocumentPickerOptions {
  multiple?: boolean;
  /** Camera capture max size (photos of documents). */
  maxSize?: number;
  quality?: number;
}

/**
 * Document upload flow: files via document picker, camera via image capture.
 */
export const useDocumentPicker = (options?: UseDocumentPickerOptions) => {
  const { multiple = false, maxSize = 1024, quality = 85 } = options || {};

  const [documents, setDocuments] = useState<PickedFile[]>([]);
  const isPickerOpen = useRef(false);

  const appendOrReplace = useCallback(
    (next: PickedFile[]) => {
      if (!next.length) return;
      if (multiple) {
        setDocuments(prev => [...prev, ...next]);
      } else {
        setDocuments(next);
      }
    },
    [multiple],
  );

  const pickFromFiles = useCallback(async () => {
    if (isPickerOpen.current) return;

    try {
      isPickerOpen.current = true;
      const result = await pickDocument({ multiple });
      if (result.cancelled || !result.documents.length) return;

      appendOrReplace(
        result.documents.map(doc => ({
          uri: doc.uri,
          name: doc.name,
          type: doc.type,
        })),
      );
    } finally {
      isPickerOpen.current = false;
    }
  }, [appendOrReplace, multiple]);

  const captureFromCamera = useCallback(async () => {
    if (isPickerOpen.current) return;

    try {
      isPickerOpen.current = true;
      const result = await pickImage({
        source: 'camera',
        multiple: false,
        maxSize,
        quality,
      });

      if (result.cancelled || !result.images.length) return;

      appendOrReplace(
        result.images.map(img => ({
          uri: img.uri,
          width: img.width,
          height: img.height,
          name: getFileNameFromUri(img.uri),
        })),
      );
    } finally {
      isPickerOpen.current = false;
    }
  }, [appendOrReplace, maxSize, quality]);

  const removeDocument = useCallback((uri: string) => {
    setDocuments(prev => prev.filter(doc => doc.uri !== uri));
  }, []);

  const resetDocuments = useCallback(() => setDocuments([]), []);

  return {
    documents,
    pickFromFiles,
    captureFromCamera,
    removeDocument,
    resetDocuments,
  };
};

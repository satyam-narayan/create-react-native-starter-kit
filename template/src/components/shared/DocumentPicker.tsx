import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  useDocumentPicker,
  type PickedFile,
} from '@/hooks/useDocumentPicker';
import ImagePickerSheet from './bottom-sheet/sheets/ImagePickerSheet';
import { BSRef } from './bottom-sheet/types';

export type DocumentPickerRef = {
  open: () => void;
  close: () => void;
};

type SourceType = 'files' | 'camera' | 'both';

interface Props {
  source?: SourceType;
  maxSize?: number;
  quality?: number;
  multiple?: boolean;
  onDocumentChange?: (file: PickedFile) => void;
}

const DocumentPicker = forwardRef<DocumentPickerRef, Props>(
  (
    {
      source = 'both',
      maxSize = 1024,
      quality = 85,
      multiple = false,
      onDocumentChange,
    },
    ref,
  ) => {
    const sheetRef = useRef<BSRef>(null);
    const { captureFromCamera, documents, pickFromFiles, resetDocuments } =
      useDocumentPicker({
        maxSize,
        quality,
        multiple,
      });

    useImperativeHandle(
      ref,
      () => ({
        open: () => {
          if (source === 'both') {
            sheetRef.current?.open();
          } else if (source === 'camera') {
            captureFromCamera();
          } else {
            pickFromFiles();
          }
        },
        close: () => sheetRef.current?.close(),
      }),
      [source, captureFromCamera, pickFromFiles],
    );

    useEffect(() => {
      if (!documents.length) return;

      onDocumentChange?.(documents[0]);
      resetDocuments();
    }, [documents, onDocumentChange, resetDocuments]);

    return (
      <ImagePickerSheet
        ref={sheetRef}
        onCamera={captureFromCamera}
        onGallery={pickFromFiles}
        canDocUpload
      />
    );
  },
);

DocumentPicker.displayName = 'DocumentPicker';

export default memo(DocumentPicker);

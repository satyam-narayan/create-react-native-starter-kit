import {
  errorCodes,
  isErrorWithCode,
  keepLocalCopy,
  pick,
  types,
  type DocumentPickerOptionsBase,
} from '@react-native-documents/picker';
import { ErrorHandler } from '@/services/errors';

export type PickedDocument = {
  uri: string;
  name: string;
  type: string | null;
};

export type PickDocumentResult = {
  documents: PickedDocument[];
  cancelled: boolean;
};

type PickDocumentOptions = {
  multiple?: boolean;
  /** MIME / UTI groups to allow. Defaults to images + common docs. */
  type?: DocumentPickerOptionsBase['type'];
};

const DEFAULT_TYPES: NonNullable<DocumentPickerOptionsBase['type']> = [
  types.images,
  types.pdf,
  types.doc,
  types.docx,
  types.plainText,
];

/**
 * Pick one or more files from the device (images, PDFs, docs, etc.).
 */
export const pickDocument = async (
  options?: PickDocumentOptions,
): Promise<PickDocumentResult> => {
  const multiple = options?.multiple ?? false;
  const type = options?.type ?? DEFAULT_TYPES;

  try {
    const results = await pick({
      type,
      allowMultiSelection: multiple,
    });

    if (!results.length) {
      return { documents: [], cancelled: true };
    }

    const documents: PickedDocument[] = [];

    for (const file of results) {
      if (!file.uri) continue;

      const fileName = file.name ?? 'document';
      const [copyResult] = await keepLocalCopy({
        files: [
          {
            uri: file.uri,
            fileName,
          },
        ],
        destination: 'cachesDirectory',
      });

      const localUri =
        copyResult?.status === 'success' ? copyResult.localUri : file.uri;

      documents.push({
        uri: localUri,
        name: fileName,
        type: file.type ?? null,
      });
    }

    return {
      documents,
      cancelled: documents.length === 0,
    };
  } catch (error) {
    if (
      isErrorWithCode(error) &&
      error.code === errorCodes.OPERATION_CANCELED
    ) {
      return { documents: [], cancelled: true };
    }

    ErrorHandler(error);
    return { documents: [], cancelled: false };
  }
};

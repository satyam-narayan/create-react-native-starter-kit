/**
 * Resolves a display file name from an optional known name or a URI path segment.
 */
export const getFileNameFromUri = (
  uri: string,
  fallbackName?: string | null,
): string => {
  if (fallbackName?.trim()) {
    return fallbackName.trim();
  }

  const segment = uri.split('/').filter(Boolean).pop();
  if (!segment) {
    return 'file';
  }

  return decodeURIComponent(segment);
};

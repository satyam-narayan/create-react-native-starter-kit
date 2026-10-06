/**
 * Convert a stored ISO date string into a Date for form fields.
 */
export const toDate = (iso: string | null | undefined): Date | undefined => {
  if (!iso) return undefined;
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

/**
 * Convert a form Date (or string) into an ISO string for storage / API.
 */
export const toIso = (
  value: Date | string | null | undefined,
): string | null => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

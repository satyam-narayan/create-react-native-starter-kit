/**
 * Masks a phone number, keeping the first `visibleDigits` digits.
 * Example: 9876543210 → +91 98XXXXXXX (default)
 */
export const maskPhone = (
  phone?: string | null,
  visibleDigits = 2,
  countryCode = '+91',
): string => {
  const digits = (phone ?? '').replace(/\D/g, '');
  if (!digits) return '—';

  const visible = digits.slice(0, visibleDigits);
  const masked = 'X'.repeat(Math.max(digits.length - visibleDigits, 0));

  return `${countryCode} ${visible}${masked}`;
};

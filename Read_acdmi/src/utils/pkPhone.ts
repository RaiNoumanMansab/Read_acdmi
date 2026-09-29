/**
 * Pakistani phone number validation & formatting utility.
 *
 * Valid formats accepted (all representing the same number):
 *   03XX-XXXXXXX  |  03XXXXXXXXX  |  +923XXXXXXXXX  |  923XXXXXXXXX
 *
 * Canonical output: +92 3XX XXXXXXX  (e.g.  +92 300 1234567)
 */

/** Regex: matches PK mobile numbers in all common local / international notations */
export const PK_PHONE_REGEX = /^(\+92|0092|92)?[-.\s]?3\d{2}[-.\s]?\d{7}$/;

/**
 * Returns true if the value looks like a valid Pakistani mobile number.
 * Strips spaces, dashes, and dots before checking.
 */
export const isValidPKPhone = (value: string): boolean => {
  const stripped = value.replace(/[\s\-\.]/g, '');
  return PK_PHONE_REGEX.test(stripped);
};

/**
 * Auto-formats a Pakistani phone number as the user types.
 * Normalises input into the canonical "+92 3XX XXXXXXX" display format.
 * Returns the raw value unchanged if it doesn't yet look like a PK number.
 */
export const formatPKPhone = (raw: string): string => {
  // Strip everything except digits and leading +
  let digits = raw.replace(/[^\d+]/g, '');

  // Remove country code prefixes so we work with bare digits
  if (digits.startsWith('+92')) digits = digits.slice(3);
  else if (digits.startsWith('0092')) digits = digits.slice(4);
  else if (digits.startsWith('92') && digits.length > 10) digits = digits.slice(2);
  else if (digits.startsWith('0')) digits = digits.slice(1); // strip leading 0

  // Only format if we have a 3XX… mobile prefix
  if (!/^3/.test(digits)) return raw;

  // Build display string progressively as user types
  const d = digits.replace(/\D/g, '');
  if (d.length <= 3) return `+92 ${d}`;
  if (d.length <= 10) return `+92 ${d.slice(0, 3)} ${d.slice(3)}`;
  return `+92 ${d.slice(0, 3)} ${d.slice(3, 10)}`; // cap at 10 digits after country
};

/**
 * Helper for onChange handlers:
 * Formats the typed value before storing it in state.
 * If the value is being cleared or doesn't start with known PK prefixes, return as-is.
 */
export const handlePKPhoneInput = (raw: string): string => {
  if (!raw) return '';
  // Only auto-format if it looks like a PK number attempt
  const stripped = raw.replace(/[\s\-\.]/g, '');
  if (/^(\+?92|0092|0|3)/.test(stripped)) {
    return formatPKPhone(raw);
  }
  return raw;
};

/** Border colour helper: red when invalid (and field has enough chars), green when valid */
export const pkPhoneBorderColor = (value: string): string => {
  if (!value || value.length < 4) return '#cbd5e1'; // neutral (untouched)
  return isValidPKPhone(value) ? '#16a34a' : '#E62929';
};

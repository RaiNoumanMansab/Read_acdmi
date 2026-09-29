/**
 * Pakistani phone number validator for backend routes
 * Accepts standard Pakistani mobile numbers:
 *   +923XXXXXXXXX, 03XXXXXXXXX, 923XXXXXXXXX, 00923XXXXXXXXX
 */
export const PK_PHONE_REGEX = /^(\+92|0092|92)?[-.\s]?3\d{2}[-.\s]?\d{7}$/;

export const isValidPKPhone = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') return false;
  const stripped = phone.replace(/[\s\-\.]/g, '');
  return PK_PHONE_REGEX.test(stripped);
};

export const normalizePKPhone = (phone: string): string => {
  if (!phone || typeof phone !== 'string') return phone;
  let digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+92')) digits = digits.slice(3);
  else if (digits.startsWith('0092')) digits = digits.slice(4);
  else if (digits.startsWith('92') && digits.length > 10) digits = digits.slice(2);
  else if (digits.startsWith('0')) digits = digits.slice(1);

  const d = digits.replace(/\D/g, '');
  if (d.length === 10 && d.startsWith('3')) {
    return `+92 ${d.slice(0, 3)} ${d.slice(3)}`;
  }
  return phone.trim();
};

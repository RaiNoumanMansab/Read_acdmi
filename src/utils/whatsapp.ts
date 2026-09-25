/**
 * WhatsApp Utility Helper Functions
 * Formats Pakistani / International numbers and generates direct chat links
 */

export const SCHOOL_WHATSAPP_NUMBER = '923216909047'; // 0321-6909047 / +92 321 6909047

/**
 * Normalizes phone numbers into clean international format without '+', spaces, or hyphens.
 * Specifically converts Pakistani local formats:
 * - '03001234567' -> '923001234567'
 * - '0300-1234567' -> '923001234567'
 * - '+92 300 1234567' -> '923001234567'
 * - '3001234567' (10 digits) -> '923001234567'
 */
export const formatWhatsAppNumber = (phone: string): string => {
  if (!phone) return '';

  // Remove all non-digits
  let cleaned = phone.replace(/\D/g, '');

  // Strip international dial prefix '00'
  if (cleaned.startsWith('00')) {
    cleaned = cleaned.substring(2);
  }

  // Pakistan local format: starting with '03' (11 digits e.g. 03001234567)
  if (cleaned.startsWith('03') && cleaned.length === 11) {
    cleaned = '92' + cleaned.substring(1);
  } else if (cleaned.startsWith('3') && cleaned.length === 10) {
    cleaned = '92' + cleaned;
  }

  return cleaned;
};

/**
 * Returns direct WhatsApp URL
 */
export const getWhatsAppUrl = (phone: string, text?: string): string => {
  const formatted = formatWhatsAppNumber(phone);
  if (!formatted) return '#';
  const query = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${formatted}${query}`;
};

/**
 * Opens WhatsApp chat in a new tab
 */
export const openWhatsApp = (phone: string, text?: string): void => {
  const url = getWhatsAppUrl(phone, text);
  if (url && url !== '#') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

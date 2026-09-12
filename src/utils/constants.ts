/**
 * Central system configuration and constants
 */

// Authorized Admin Firebase Authentication UIDs
export const ADMIN_UIDS: string[] = [
  'co8SdsAOxHgJJ6poAyiQQMbETKc2',
  'vMSdoIR1wjbwkVLEEmSXMpSMq4z1',
];

export const ADMIN_UID = 'co8SdsAOxHgJJ6poAyiQQMbETKc2';

// Admin Emails reference
export const ADMIN_EMAILS: string[] = [
  'yusufabozdemir@gmail.com',
];

// WhatsApp Official Support / Upgrade Contact
export const SUPPORT_WHATSAPP_NUMBER = '905415266022'; // 0541 526 60 22
export const SUPPORT_PHONE_DISPLAY = '0541 526 60 22';

/**
 * Generates direct WhatsApp chat link with custom message
 */
export function getWhatsAppDirectUrl(message?: string): string {
  const defaultText = 'Merhaba, Durumu Ne? hakkında bilgi almak istiyorum.';
  const text = message || defaultText;
  return `https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Generates the official WhatsApp link for upgrading to Pro
 */
export function getProUpgradeWhatsAppUrl(businessName?: string): string {
  const name = businessName ? businessName.trim() : 'İşletmem';
  const text = `Merhaba Durumu Ne?, işletmem için Pro paket lisansı hakkında bilgi almak ve geçiş yapmak istiyorum. İşletme adım: ${name}`;
  return `https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Generates the official WhatsApp link for trial ending inquiries
 */
export function getTrialWarningWhatsAppUrl(businessName?: string, daysLeft?: number): string {
  const name = businessName ? businessName.trim() : 'İşletmem';
  const daysText = typeof daysLeft === 'number' ? `bitmesine ${daysLeft} gün kaldı` : 'bitmek üzere';
  const text = `Merhaba Durumu Ne?, deneme sürem ${daysText}. Pro paket hakkında bilgi almak ve geçiş yapmak istiyorum. İşletme adım: ${name}`;
  return `https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Check if a given UID or verified email belongs to the system administrator.
 */
export function isSystemAdmin(uid?: string | null, email?: string | null): boolean {
  if (uid && ADMIN_UIDS.includes(uid)) return true;
  if (email && ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email.toLowerCase().trim())) {
    return true;
  }
  return false;
}

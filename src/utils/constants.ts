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

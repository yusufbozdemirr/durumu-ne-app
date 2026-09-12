import { getToken, onMessage } from 'firebase/messaging';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, getFirebaseMessaging } from '../lib/firebase';

// VAPID key from environment variable (generated in Firebase Console > Cloud Messaging > Web configuration)
export const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || '';

/**
 * Generate a safe, unique ID for the token document
 */
function getStableTokenDocId(token: string): string {
  // Use last 32 characters of token which are alphanumeric and unique
  const sanitized = token.replace(/[^a-zA-Z0-9]/g, '');
  return sanitized.length > 32 ? sanitized.slice(-32) : sanitized;
}

export const notificationService = {
  /**
   * Check if Web Push notifications are supported in this browser
   */
  async isPushSupported(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    if (!('Notification' in window)) return false;
    if (!('serviceWorker' in navigator)) return false;
    const messaging = await getFirebaseMessaging();
    return messaging !== null;
  },

  /**
   * Get current browser notification permission
   */
  getPermission(): NotificationPermission | 'unsupported' {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  },

  /**
   * Check if this device has already registered for notifications for this specific vehicle
   */
  isSubscribedForVehicle(publicToken: string): boolean {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const saved = localStorage.getItem(`durumu_ne_fcm_${publicToken}`);
    return Boolean(saved && Notification.permission === 'granted');
  },

  /**
   * Register service worker and request Web Push FCM token for the public vehicle
   */
  async subscribeToVehicleNotifications(publicToken: string): Promise<{
    success: boolean;
    token?: string;
    error?: string;
    permissionDenied?: boolean;
  }> {
    try {
      if (!('Notification' in window) || !('serviceWorker' in navigator)) {
        return { success: false, error: 'Tarayıcınız Web Push bildirimlerini desteklemiyor.' };
      }

      // 1. Request user permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return {
          success: false,
          permissionDenied: true,
          error: 'Bildirim izni verilmedi. Tarayıcı adres çubuğundaki kilit simgesinden izin verebilirsiniz.',
        };
      }

      // 2. Register or obtain Service Worker
      let swRegistration: ServiceWorkerRegistration;
      try {
        swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/',
        });
        await navigator.serviceWorker.ready;
      } catch (swErr) {
        console.error('Service worker kayıt hatası:', swErr);
        return {
          success: false,
          error: 'Service Worker başlatılamadı. HTTPS veya localhost kullandığınızdan emin olun.',
        };
      }

      // 3. Obtain Firebase Messaging instance
      const messaging = await getFirebaseMessaging();
      if (!messaging) {
        return {
          success: false,
          error: 'Firebase Messaging servisi bu tarayıcıda başlatılamadı.',
        };
      }

      // 4. Request FCM Token using VAPID key
      const tokenOptions: { serviceWorkerRegistration: ServiceWorkerRegistration; vapidKey?: string } = {
        serviceWorkerRegistration: swRegistration,
      };

      if (VAPID_KEY && VAPID_KEY.trim().length > 0) {
        tokenOptions.vapidKey = VAPID_KEY.trim();
      }

      let fcmToken = '';
      try {
        fcmToken = await getToken(messaging, tokenOptions);
      } catch (tokenErr: any) {
        console.error('FCM Token alma hatası:', tokenErr);
        const errMsg = tokenErr?.message || '';
        if (errMsg.includes('push-service-error') || errMsg.includes('vapid') || errMsg.includes('key')) {
          return {
            success: false,
            error: 'FCM VAPID anahtarı yapılandırması gerekli. Firebase Console Cloud Messaging bölümünden Web Push Key oluşturulmalıdır.',
          };
        }
        return {
          success: false,
          error: `FCM bildirim anahtarı alınamadı: ${errMsg || 'Bilinmeyen hata'}`,
        };
      }

      if (!fcmToken) {
        return { success: false, error: 'Cihaz bildirim belirteci (FCM token) oluşturulamadı.' };
      }

      // 5. Store token in Firestore under publicVehicles/{publicToken}/notificationTokens/{tokenId}
      const tokenId = getStableTokenDocId(fcmToken);
      const tokenDocRef = doc(db, 'publicVehicles', publicToken, 'notificationTokens', tokenId);

      await setDoc(tokenDocRef, {
        token: fcmToken,
        publicToken,
        active: true,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        platform: typeof navigator !== 'undefined' ? (navigator as any).userAgentData?.platform || 'web' : 'web',
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      }, { merge: true });

      // 6. Save in localStorage
      localStorage.setItem(`durumu_ne_fcm_${publicToken}`, fcmToken);

      return {
        success: true,
        token: fcmToken,
      };
    } catch (err: any) {
      console.error('Bildirim aboneliği sırasında beklenmeyen hata:', err);
      return {
        success: false,
        error: err?.message || 'Bildirim aboneliği gerçekleştirilemedi.',
      };
    }
  },

  /**
   * Listen for incoming messages while user is on the active tab (foreground)
   */
  async setupForegroundListener(
    onMessageReceived: (payload: { title?: string; body?: string; data?: any }) => void
  ): Promise<(() => void) | null> {
    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;

    try {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('[Foreground Notification]', payload);
        const title = payload.notification?.title || payload.data?.title || 'Durumu Ne?';
        const body = payload.notification?.body || payload.data?.body || 'Araç durumunuz güncellendi.';
        onMessageReceived({ title, body, data: payload.data });
      });
      return unsubscribe;
    } catch (err) {
      console.warn('Foreground dinleyici başlatılamadı:', err);
      return null;
    }
  },
};

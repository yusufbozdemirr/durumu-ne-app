import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, isSupported, Messaging } from 'firebase/messaging';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBtdao2SHnUZWukyQJQcS1Rj-5RFnG0YNM',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'durumu-ne-app.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'durumu-ne-app',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'durumu-ne-app.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '593522702655',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:593522702655:web:a16fe7990c525bc2c9fb8a',
};

// Initialize Firebase once
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Lazy messaging instance with browser support check
let messagingInstance: Messaging | null = null;
export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (typeof window === 'undefined') return null;
  try {
    const supported = await isSupported();
    if (!supported) return null;
    if (!messagingInstance) {
      messagingInstance = getMessaging(app);
    }
    return messagingInstance;
  } catch (err) {
    console.warn('Firebase Messaging desteklenmiyor:', err);
    return null;
  }
}

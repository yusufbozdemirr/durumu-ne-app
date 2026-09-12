/**
 * DURUMU NE? - Firebase Cloud Messaging Service Worker
 * Background Web Push Notification Handler
 */

// Import Firebase scripts for Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

// Initialize Firebase inside the Service Worker
firebase.initializeApp({
  apiKey: "AIzaSyBtdao2SHnUZWukyQJQcS1Rj-5RFnG0YNM",
  authDomain: "durumu-ne-app.firebaseapp.com",
  projectId: "durumu-ne-app",
  storageBucket: "durumu-ne-app.firebasestorage.app",
  messagingSenderId: "593522702655",
  appId: "1:593522702655:web:a16fe7990c525bc2c9fb8a",
});

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Arka plan bildirimi alındı:', payload);

  const title = payload.notification?.title || payload.data?.title || 'Durumu Ne?';
  const body =
    payload.notification?.body ||
    payload.data?.body ||
    'Aracınızın durumunda yeni bir güncelleme yapıldı.';
  const publicToken = payload.data?.publicToken || '';
  const url = payload.data?.url || (publicToken ? `/takip/${publicToken}` : '/');

  const notificationOptions = {
    body,
    icon: '/logo.png',
    badge: '/favicon.png',
    data: {
      url,
      publicToken,
    },
    tag: publicToken ? `vehicle-${publicToken}` : 'vehicle-status-update',
    renotify: true,
  };

  return self.registration.showNotification(title, notificationOptions);
});

// Notification click event: focus open window or navigate to /takip/{publicToken}
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetPath = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Look for already open client tab
      for (const client of windowClients) {
        if (client.url && client.url.includes(targetPath) && 'focus' in client) {
          return client.focus();
        }
      }
      // If none matches the exact path, find any app tab and navigate
      for (const client of windowClients) {
        if (client.url && 'focus' in client && 'navigate' in client) {
          client.focus();
          return client.navigate(targetPath);
        }
      }
      // Otherwise open new window
      if (clients.openWindow) {
        return clients.openWindow(targetPath);
      }
    })
  );
});

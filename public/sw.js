self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Find an open client tab and focus on it
      for (const client of windowClients) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      // If none open, open the root path
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

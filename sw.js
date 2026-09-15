self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

// Ascolta i comandi di notifica inviati dall'app quando è in background
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const d = event.data;
    event.waitUntil(
      self.registration.showNotification(d.title, {
        body: d.body,
        icon: d.icon || 'https://api.dicebear.com/7.x/identicon/svg?seed=ChroniclesRP',
        badge: d.icon || 'https://api.dicebear.com/7.x/identicon/svg?seed=ChroniclesRP',
        vibrate: [150, 80, 150],
        data: { url: './index.html' }
      })
    );
  }
});

// Cliccando sulla notifica si riapre l'app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./index.html');
      }
    })
  );
});

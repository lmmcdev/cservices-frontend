self.addEventListener('push', function(event) {
  const data = event.data.json();
  const title = 'System Notification';
  const options = {
    body: data.body,
    icon: '/logo192.png',
    badge: '/badge-icon.png',
    image: data.image, // URL a imagen grande
    vibrate: [100, 50, 100],
    tag: data.tag || 'general',
    renotify: true,
    requireInteraction: false,
    actions: [
      {action: 'open', title: 'Abrir App', icon: '/open-icon.png'},
      {action: 'dismiss', title: 'Cerrar', icon: '/close-icon.png'}
    ],
    data: {
      url: data.url,  // Puedes usarlo para abrir una página específica al click
      customInfo: data.customInfo,
    }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'open') {
    clients.openWindow(event.notification.data.url || '/');
  }
  // Puedes manejar otras acciones aquí
});

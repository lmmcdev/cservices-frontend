self.addEventListener('push', function(event) {
  //console.log(event)
  const data = event.data.json();
  
  const title = data.title || 'System Notification';
  // Puedes personalizar el cuerpo y otros detalles de la notificación
  const details = data;
  console.log('🔔 Notification details:', details.data);
  const options = {
    body: details.data.message || 'Important Message.',
    icon: details.data.icon || '/logo192.png',
    badge: '/badge-icon.png',
    image: details.data.image || '/noti-banner.png', // puede que Firefox la ignore
     tag: `ticket-notification-${details.data.ticketId}`,
    renotify: true,
    requireInteraction: true, // ⚠️ No funciona en Firefox
    actions: [
      {action: 'open', title: 'View Details', icon: '/open-icon.png'},
      {action: 'dismiss', title: 'Ignore', icon: '/close-icon.png'}
    ],
    data: {
      url: data.url || '/',
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

// Service Worker for Real-time Web Push Notifications
self.addEventListener('push', (event) => {
  let data = {
    title: "New Notification",
    body: "You have a new update from Cake Baker's!",
    url: "/"
  };

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (err) {
    console.error('Error parsing push data:', err);
    if (event.data) {
      data = {
        title: "Cake Baker's Update",
        body: event.data.text(),
        url: "/"
      };
    }
  }

  const options = {
    body: data.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/992/992717.png', // Premium cake logo icon
    badge: 'https://cdn-icons-png.flaticon.com/512/992/992717.png', // Small tray badge
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Open App'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already a window open with this app
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          // Navigate to the target page if it isn't already there
          if (client.url !== self.location.origin + targetUrl) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

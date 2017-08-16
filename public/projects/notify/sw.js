self.addEventListener('message', function(event) {
  const options = {
    "body": event.data.body?event.data.body:event.data,
    "tag": "m1",
    "renotify": true,
    "actions": [  
       {action: 'like', title: '👍Like'},  
       {action: 'reply', title: '⤻ Reply'}],
    "onclick":"https://www.google.co.in",
    "requireInteraction": true,
    "badge": '/images/demos/badge-128x128.png',
    "timestamp": Date.parse('01 Jan 2000 00:00:00'),
    "vibrate": [20,100,80]
  };
  self.registration.showNotification(event.data.title?event.data.title:'Controller + Push And message', options)
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
  if (event.ports[0]) {
    event.ports[0].postMessage({
      error: null,
      urls: "urls"
    });
  }
});

self.addEventListener('notificationclose', function(event) {
  console.log("close");
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'like') {  
    console.log("like");
  }  
  else if (event.action === 'reply') {  
    console.log("reply");
  }else{
    console.log("click");
  }
}, false);

self.addEventListener('activate', function(event) {
  event.waitUntil(
    clients.claim().then(function() {
      return self.clients.matchAll().then(function(clients) {
        return Promise.all(clients.map(function(client) {
          return client.postMessage('The service worker has activated and ' +
            'taken control.');
        }));
      });
    })
  );
});
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// Initialize Firebase with your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7eoKFwpeXNH0KfP5uXzjh1NCmZ4kXXdo",
  authDomain: "fir-61f66.firebaseapp.com",
  projectId: "fir-61f66",
  storageBucket: "fir-61f66.firebasestorage.app",
  messagingSenderId: "731456850392",
  appId: "1:731456850392:web:56db706c0e3de305078aad",
  measurementId: "G-QMQVRQWP4V"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const link = payload.fcmOptions?.link||payload.data?.link;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192x192.png', // Example icon
    data:{url:link}
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick',function(event){
  console.log('[firebase-messaging-sw.js] Notificatioin click received');

  event.notification.close();

  event.waitUntill(
    clients
    .matchAll({type:'window', includeUncontrolled:true})
    .then(function (clientList){
     const url = event.notification.data.url;

     if(!url){
      return;
     }
     for(const client of clientList){
      if(client.url===url && 'focus' in client){return client.focus}
     }

     if(clients.openWindow){
      console.log("OPENWINDOW ON CLIENT");
      return clients.openWindow(url);
     }
    })
  )
})
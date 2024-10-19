// firebase-messaging-sw.js
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging/sw';

// Your Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyCAUmh43VIZhzXPsCk565bplDWU8vYVlc8',
  appId: '1:1035230545456:web:1ac1de2d0859ed4fbecff5',
  messagingSenderId: '1035230545456',
  projectId: 'miiscollpcomplaintapp',
  authDomain: 'miiscollpcomplaintapp.firebaseapp.com',
  storageBucket: 'miiscollpcomplaintapp.appspot.com',
  measurementId: 'G-7YVGB53X4V'
};
const firebaseConfigAdmin = {
    apiKey: "AIzaSyC1SF8q6X8SG3EabV2dROVkA6Ach_iz__0",
    authDomain: "push-notification-ce551.firebaseapp.com",
    projectId: "push-notification-ce551",
    storageBucket: "push-notification-ce551.appspot.com",
    messagingSenderId: "159414733879",
    appId: "1:159414733879:web:2b28149b9d6263124dc3b2",
    measurementId: "G-QLG8D0CLGL"
  };
  // Initialize Firebase
  //const app = initializeApp(firebaseConfig);
 const app = initializeApp(firebaseConfigAdmin);
const messaging = getMessaging(app);
// Background message handler
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || 'Background Message Title';
  const notificationOptions = {
    body: payload.notification?.body || 'Background Message body.',
    icon: payload.notification.image||'/firebase-logo.png'
  };

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

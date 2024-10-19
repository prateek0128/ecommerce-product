// // NotificationHandler.tsx
// import React, { useEffect } from 'react';
// import { getToken, onMessage } from 'firebase/messaging';
// import { messaging } from 'config/firebase'; // Your Firebase config

// const NotificationHandler: React.FC = () => {
//   useEffect(() => {
//     const requestPermission = async () => {
//       try {
//         const permission = await Notification.requestPermission();
//         if (permission === 'granted') {
//           console.log('Notification permission granted.');
//           const token = await getToken(messaging, { vapidKey: 'your-public-vapid-key' });
//           if (token) {
//             console.log('FCM Token:', token);
//             // Send this token to your server to handle push notifications
//           } else {
//             console.log('No registration token available.');
//           }
//         } else {
//           console.log('Unable to get permission to notify.');
//         }
//       } catch (error) {
//         console.error('An error occurred while retrieving token:', error);
//       }
//     };

//     requestPermission();

//   // Listen for incoming messages when the app is in the foreground
// onMessage(messaging, (payload) => {
//   console.log('Message received. ', payload);
//   // Show notification or update the UI as needed
// });
// }, []);

//   return null; // No UI for this component
// };

// export default NotificationHandler;

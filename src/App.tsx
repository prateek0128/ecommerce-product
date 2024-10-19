import { RouterProvider } from 'react-router-dom';

// project import
import router from 'routes';
import ThemeCustomization from 'themes';

import Locales from 'components/Locales';
import RTLLayout from 'components/RTLLayout';
import ScrollTop from 'components/ScrollTop';
import Customization from 'components/Customization';
import Snackbar from 'components/@extended/Snackbar';
import Notistack from 'components/third-party/Notistack';
import { messaging } from 'config/firebase';
import { getToken, onMessage, Messaging, getMessaging } from 'firebase/messaging';

// auth-provider
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
import { useEffect } from 'react';
import { subscribeNotification } from './apiServices/notification';
//import NotificationHandler from './notification/notificationHandler';
// import { FirebaseProvider as AuthProvider } from 'contexts/FirebaseContext';
// import { AWSCognitoProvider as AuthProvider } from 'contexts/AWSCognitoContext';
// import { Auth0Provider as AuthProvider } from 'contexts/Auth0Context';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

export default function App() {
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          // First, check if the current token is valid
          let currentToken = await getToken(messaging, {
            //vapidKey: 'BPGc1o0JfMU2PFYx2U5ByIt7dw9PZ5MdD_IkJgf_B5o-xen_-tIQyE-bNqksz1GkJZyUt4Kx7GsErNxeIQZGRMY'
            vapidKey: 'BN5p9XUM4MbAQlZlZsNrgnum8r7Z3NGrVr7tEvEg3sgz4w1o9eb-w68LqoiQPC5pawBFlFYFXZ5T9G6C91H2GlE'
          });
          if (currentToken) {
            console.log('FCM Token:', currentToken);
            // Subscribe to the server
            const tokenData = { token: currentToken, topic: 'notification' };
            await subscribeNotification(tokenData);
          } else {
            console.log('No registration token available. Requesting a new token...');
            const newToken = await getToken(messaging, {
              //vapidKey: 'BPGc1o0JfMU2PFYx2U5ByIt7dw9PZ5MdD_IkJgf_B5o-xen_-tIQyE-bNqksz1GkJZyUt4Kx7GsErNxeIQZGRMY'
              vapidKey: 'BN5p9XUM4MbAQlZlZsNrgnum8r7Z3NGrVr7tEvEg3sgz4w1o9eb-w68LqoiQPC5pawBFlFYFXZ5T9G6C91H2GlE'
            });
            if (newToken) {
              console.log('New FCM Token:', newToken);
              const tokenData = { token: newToken, topic: 'notification' };
              await subscribeNotification(tokenData);
            } else {
              console.log('No new token generated.');
            }
          }
        } else {
          console.log('Unable to get permission to notify.');
        }
      } catch (error) {
        console.error('An error occurred while retrieving token:', error);
      }
    };

    requestPermission();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      // Show notification or update the UI as needed
    });
  }, []);

  return (
    <ThemeCustomization>
      <RTLLayout>
        <Locales>
          <ScrollTop>
            <AuthProvider>
              <>
                <Notistack>
                  <RouterProvider router={router} />
                  <Customization />
                  <Snackbar />
                  {/* <NotificationHandler /> */}
                </Notistack>
              </>
            </AuthProvider>
          </ScrollTop>
        </Locales>
      </RTLLayout>
    </ThemeCustomization>
  );
}

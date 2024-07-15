import React, {useEffect} from 'react';
import Config from 'react-native-config';

import {PermissionsAndroid} from 'react-native';
import AuthProvider from './src/auth/AuthContext';
import Routes from './src/Routes';
import {PaperProvider} from 'react-native-paper';
import Toast, {
  BaseToastProps,
  ErrorToast,
  SuccessToast,
} from 'react-native-toast-message';
import {NavigationContainer} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

//const authData = false;

function App(this: any): React.JSX.Element {
  useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    );
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
    console.log(Config.API_URL);
  }, []);

  /*
  1. Create the config
*/
  const toastConfig = {
    success: (props: BaseToastProps) => (
      <SuccessToast
        {...props}
        text1Style={{
          fontSize: 15,
        }}
      />
    ),

    error: (props: BaseToastProps) => (
      <ErrorToast
        {...props}
        text1Style={{
          fontSize: 15,
        }}
      />
    ),
  };

  return (
    <>
      <AuthProvider>
        <PaperProvider>
          <Routes />
        </PaperProvider>
      </AuthProvider>
      <Toast config={toastConfig} />
    </>
  );
}

export default App;

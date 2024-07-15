import React, {useEffect} from 'react';
import Config from 'react-native-config';

import {PermissionsAndroid} from 'react-native';
import AuthProvider from './src/auth/AuthContext';
import Routes from './src/Routes';
import {PaperProvider} from 'react-native-paper';
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

  return (
    <AuthProvider>
      <PaperProvider>
        <Routes />
      </PaperProvider>
    </AuthProvider>
  );
}

export default App;

import React, {useEffect} from 'react';
import Config from 'react-native-config';

import {PermissionsAndroid} from 'react-native';
import AuthProvider from './src/auth/AuthContext';
import Routes from './src/Routes';
import {PaperProvider, MD3LightTheme as DefaultTheme} from 'react-native-paper';
import Toast, {
  BaseToastProps,
  ErrorToast,
  SuccessToast,
} from 'react-native-toast-message';
import SettingProvider from './src/settings/SettingContext';

function App(this: any): React.JSX.Element {
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

  const theme = {
    ...DefaultTheme,
    myOwnProperty: true,
    colors: {
      ...DefaultTheme.colors,
      primary: '#49494C',
      onSurface: '#AAAAAA', // text
      //secondary: "#49CC93",
      tertiary: '#49CC93',
      background: '#FFFFFF',
      onSurfaceVariant: '#AAAAAA', // placeholder
    },
  };

  useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    );
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
    console.log(Config.API_URL);
  }, []);

  return (
    <>
      <SettingProvider>
        <AuthProvider>
          <PaperProvider theme={theme}>
            <Routes />
          </PaperProvider>
        </AuthProvider>
      </SettingProvider>
      <Toast config={toastConfig} />
    </>
  );
}

export default App;

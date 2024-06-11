import {NavigationContainer} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import WithAxios from './api/WithAxios';
import LoginScreen from './screens/login/LoginScreen';
import BluetoothDevices from './screens/BluetoothDevices';
import OrderList from './screens/orders/OrderList';
import {AuthContext} from './auth/AuthContext';
import { getStorageData } from './utils/jwt';

const Stack = createNativeStackNavigator();

function Routes() {
  // const {authData} = useContext(AuthContext);
const queryClient = new QueryClient();

  

  // useEffect(() => {
  //   if (authToken) {
  //     navigation.replace('BluetoothDevices');
  //   }
  // }, [authToken, navigation]);

  return (
    // <WithAxios>
    <QueryClientProvider client={queryClient}>
        <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />

      <Stack.Screen name="BluetoothDevices" component={BluetoothDevices} options={{ title: 'Select BT Printer' }}/>
      <Stack.Screen name="OrderList" component={OrderList} options={{ title: 'Orders' }}/>
    </Stack.Navigator>
    </NavigationContainer>
      </QueryClientProvider>
    // </WithAxios>
  );
}

export default Routes;

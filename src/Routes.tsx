import { NavigationContainer } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WithAxios from './api/WithAxios';
import LoginScreen from './screens/login/LoginScreen';
import BluetoothDevices from './screens/BluetoothDevices';
import OrderList from './screens/orders/OrderList';
import { AuthContext } from './auth/AuthContext';
import { getStorageData, removeStorageData } from './utils/jwt';

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
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="BluetoothDevices"
            component={BluetoothDevices}
            options={({ navigation }) => ({
              title: 'Select BT Printer',
              headerRight: () => {
                // Call the logout function from BluetoothDevices component
                const logout = () => {
                  removeStorageData('authToken');
                  navigation.navigate('Login');
                };
                return <Button onPress={logout} title="Logout" color="#f4511e" />;
              },
            })}
          />
          <Stack.Screen
            name="OrderList"
            component={OrderList}
            options={({ navigation }) => ({
              title: 'Orders',
              headerRight: () => {
                // Call the logout function from BluetoothDevices component
                const logout = () => {
                  removeStorageData('authToken');
                  navigation.navigate('Login');
                };
                return <Button onPress={logout} title="Logout" color="#f4511e" />;
              },
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
    // </WithAxios>
  );
}

export default Routes;

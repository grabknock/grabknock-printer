import {NavigationContainer, useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {Button} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import LoginScreen from './screens/login/LoginScreen';
import BluetoothDevices from './screens/BluetoothDevices';
import OrderList from './screens/orders/OrderList';
import {AuthContext} from './auth/AuthContext';

const Stack = createNativeStackNavigator();

function Routes() {
  const {authData, userLogout: userLogoutContext} = useContext(AuthContext);
  const queryClient = new QueryClient();

  const [nav, setNav] = useState<any>(null)


  return (
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
          {/* removes the login screen completly from navigation stack if user is Logged in */}
          {/* Moves to the next available navigation after login */}
          {!authData && ( 
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
          )}

          <Stack.Screen
            name="BluetoothDevices"
            component={BluetoothDevices}
            options={({navigation}) => ({
              headerShown: false
            })}
          />
          <Stack.Screen
            name="OrderList"
            component={OrderList}
            options={({navigation}) => ({
              headerShown: false
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

export default Routes;

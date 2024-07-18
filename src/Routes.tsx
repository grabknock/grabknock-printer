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

  // Redirect the user to login page if th auth data is null
  // to do: must be a better way to do this
  useEffect(() => {
    if (nav != null && authData == null) {
      queryClient.cancelQueries()
        .then(() => nav.navigate("Login"));
      
    }
  }, [nav, authData])
  

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
          {/* Moves to the next available navigation */}
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
              title: 'Select BT Printer',
              headerRight: () => {
                const logout = () => {
                  userLogoutContext();
                  setNav(navigation)
                };
                return (
                  <Button onPress={logout} title="Logout" color="#f4511e" />
                );
              },
            })}
          />
          <Stack.Screen
            name="OrderList"
            component={OrderList}
            options={({navigation}) => ({
              title: 'Orders',
              headerRight: () => {
                const logout = () => {
                  userLogoutContext();
                  setNav(navigation)
                };
                return (
                  <Button onPress={logout} title="Logout" color="#f4511e" />
                );
              },
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

export default Routes;

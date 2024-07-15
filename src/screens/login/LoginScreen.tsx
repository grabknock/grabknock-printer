import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import Separator from '../../components/Separator';
import CustomButton from '../../components/buttons/CustomButton';
import {useLogin} from '../../api/auth';
import {LoginPayload} from '../../api/auth';
import {isAxiosError} from 'axios';
import {stringMd5} from 'react-native-quick-md5';
import {AuthContext} from '../../auth/AuthContext';
import {getStorageData, storeData} from '../../utils/jwt';
import {TextInput} from 'react-native-paper';
import Toast from 'react-native-toast-message';

function LoginScreen({navigation}: any) {
  // const [email, onChangeEmail] = useState('asube001+admin@odu.edu');
  // const [password, onChangePassword] = useState('Abiral1234?');
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // const {authData, setAuthData} = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      const authToken = JSON.parse(
        (await getStorageData('ACCESS_TOKEN')) || '',
      );
      if (authToken) navigation.navigate('BluetoothDevices');
    })();
  }, []);

  const {mutateAsync: postLogin, isPending: isLoginPending} = useLogin();

  const handleLogin = async () => {
    try {
      setLoading(true);
      console.log('handleLogin');
      const {data} = await postLogin({
        email_address: email,
        password: stringMd5(password),
        user_source: 'BASIC',
        device_platform: 'WEB',
      });
      setLoading(false);
      // setAuthData(data.data);
      storeData('ACCESS_TOKEN', JSON.stringify(data.data));

      Toast.show({
        type: "success",
        text1: "Login Successful!",
        position: "bottom"
      })

      //navigation.navigate('OrderList');

      navigation.navigate('BluetoothDevices');
    } catch (err) {
      setLoading(false)
      if (isAxiosError(err)) {
        console.error("Error during login", err.response);
      }
      Toast.show({
        type: "error",
        text1: "Login Failed!",
        position: "bottom"
      })
    }
  };

  return (
    <View style={{...styles.container, justifyContent: 'space-between'}}>
      {/* <Text style={styles.title}>Admin Login</Text> */}
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Image
              style={styles.img}
              source={require('../../assets/img/grabknock.png')}
            />

            <View>
              <TextInput
                label="Email"
                style={styles.input}
                onChangeText={onChangeEmail}
                value={email}
                placeholder="Email"
                placeholderTextColor="#000"
              />

              <Separator marginVertical={4} />

              <TextInput
                label="Password"
                secureTextEntry={!showPassword}
                style={styles.input}
                onChangeText={onChangePassword}
                value={password}
                placeholder="Password"
                placeholderTextColor="#000"
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
            </View>

            <CustomButton text={'Login'} onPress={handleLogin} />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    gap: 30,
    marginHorizontal: 14,
  },
  img: {
    alignSelf: 'center',
    width: 150,
    height: 150,
    marginTop: -90,
  },
  title: {
    //textAlign: 'center',
    color: 'black',
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  input: {
    margin: 1,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 6,
    color: 'black',
    shadowColor: 'none',
    elevation: 0
  }
});

export default LoginScreen;

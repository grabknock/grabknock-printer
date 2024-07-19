import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Image,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Separator from '../../components/Separator';
import CustomButton from '../../components/buttons/CustomButton';
import {useLogin} from '../../api/auth';
import {isAxiosError} from 'axios';
import {stringMd5} from 'react-native-quick-md5';
import {AuthContext} from '../../auth/AuthContext';
import {getStorageData} from '../../utils/jwt';
import {TextInput, Text} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import {useTheme} from 'react-native-paper';
import AppLoader from '../../components/loader/AppLoader';

function LoginScreen({navigation}: any) {
  const theme = useTheme();

  //const [email, onChangeEmail] = useState('asube001+admin@odu.edu');
  //const [password, onChangePassword] = useState('Abiral1234?');
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {authData, userLogin: userLoginContext} = useContext(AuthContext);

  const passwordInputRef = useRef<any>(null);
  const loginButtonRef = useRef<any>(null);

  useEffect(() => {
    if (authData) navigation.navigate('BluetoothDevices');

    (async () => {
      // get email from local storage
      const storageEmail = await getStorageData('ADMIN_EMAIL');
      if (storageEmail) onChangeEmail(storageEmail);
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
      userLoginContext(data.data);

      Toast.show({
        type: 'success',
        text1: 'Login Successful!',
        position: 'bottom',
      });

      navigation.navigate('OrderList');

      //navigation.navigate('BluetoothDevices');
    } catch (err) {
      setLoading(false);
      if (isAxiosError(err)) {
        console.error('Error during login', err.response);
      }
      Toast.show({
        type: 'error',
        text1: 'Login Failed!',
        position: 'bottom',
      });
    }
  };

  if (loading) {
    return <AppLoader />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View
          style={{
            display: 'flex',
            flex: 1,
            backgroundColor: theme.colors.background,
          }}>
          <View
            style={{
              display: 'flex',
              flex: 1,
            }}>
            <View style={{...styles.container, justifyContent: 'center'}}>
              <View>
                <Image
                  style={styles.img}
                  source={require('../../assets/img/grabknock.png')}
                />
              </View>
              <View>
                <Text variant="headlineSmall">Welcome to</Text>
                <Text
                  variant="displayMedium"
                  style={{fontWeight: 800, color: theme.colors.primary}}>
                  Grabknock
                </Text>
              </View>

              <View>
                <Text variant="bodyLarge">
                  <Text style={{fontWeight: 800, color: theme.colors.primary}}>
                    Sign In
                  </Text>{' '}
                  using you{' '}
                  <Text style={{fontWeight: 800, color: theme.colors.primary}}>
                    restaurant admin
                  </Text>{' '}
                  account.
                </Text>
              </View>

              <View>
                <TextInput
                  label="Email"
                  mode="outlined"
                  style={styles.input}
                  onChangeText={onChangeEmail}
                  value={email}
                  placeholder="Email"
                  placeholderTextColor="#000"
                  onSubmitEditing={() => passwordInputRef?.current?.focus()}
                />

                <Separator marginVertical={4} />

                <TextInput
                  label="Password"
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  onChangeText={onChangePassword}
                  value={password}
                  placeholder="Password"
                  placeholderTextColor="#000"
                  ref={passwordInputRef}
                  onSubmitEditing={() => loginButtonRef?.current?.focus()}
                  right={
                    <TextInput.Icon
                      style={{marginTop: 12}}
                      icon={showPassword ? 'eye-off' : 'eye'}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />
              </View>
              <View>
                <CustomButton
                  ref={loginButtonRef}
                  text={'Login'}
                  onPress={handleLogin}
                />
              </View>
            </View>
            <View style={{marginBottom: 10, alignItems: 'center'}}>
              <Text variant="bodyMedium">
                Copyright © {new Date().getFullYear()}{' '}
                <Text style={{fontWeight: 800, color: theme.colors.primary}}>
                  GrabKnock
                </Text>
                . All Rights Reserved
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'stretch',
    //justifyContent: 'center',
    gap: 30,
    marginHorizontal: 24,
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
    borderRadius: 6,
    height: 55,
  },
});

export default LoginScreen;

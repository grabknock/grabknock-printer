import axios from 'axios';
import {API_URL} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const privateInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getAuth = async () => await AsyncStorage.getItem("access_token");


privateInstance.interceptors.request.use(
    (config) => {
      const accessToken  = getAuth();
  
      if (config.headers) {
        config.headers.Authorization = 'Bearer ' + accessToken;
      }
  
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  export default privateInstance;

import {responseEncoding} from './../../../node_modules/axios/index.d';
import {useMutation} from '@tanstack/react-query';
//import axios from '../apiPublicInstance'
import axios from "axios";
import Config from 'react-native-config';
import { API_URL } from '../../constants';
import { UserData } from '../../auth/types';

export interface LoginPayload {
  email_address: string;
  password: string;
  user_source: string;
  device_platform: string;
}

interface LoginResponse {
  status: string;
  data: UserData;
}



export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: LoginPayload) => {
      console.log("requesting login", API_URL + '/admin/action/login', payload);
      return axios.post<LoginResponse>(API_URL + '/admin/action/login', payload);
      //return axios.get<any>('https://api.breakingbadquotes.xyz/v1/quotes');
    }
  });
};

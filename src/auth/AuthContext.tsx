import React, {createContext, useState, useContext, useEffect} from 'react';
import {AuthContextData, UserData} from './types';
import { getStorageData, removeStorageData, storeData } from '../utils/jwt';

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider = ({children}: any) => {
  const [authData, setAuthData] = useState<UserData | null>();

  useEffect(()  => {
    if (! authData) {
      setUserDataFromStorage();
    }
  }, [])

  const setUserDataFromStorage = async () => {

    const storedAdminString = await getStorageData("ADMIN_USER");
    
    if (!storedAdminString) {
      setAuthData(null);
      return;
    }

    const storedAdmin: UserData = JSON.parse(storedAdminString);
    setAuthData(storedAdmin);
    return storedAdmin;
  }

  const userLogin = (data: UserData) : boolean => {
    setAuthData(data)
    removeStorageData("ACCESS_TOKEN")
    removeStorageData("ADMIN_USER")
    removeStorageData("ADMIN_EMAIL")

    storeData("ACCESS_TOKEN", data.access_token.access_token)
    storeData("ADMIN_USER", JSON.stringify(data));
    storeData("ADMIN_EMAIL", data.email_address)

    return true;
  }

  const userLogout = async () => {
    setAuthData(null);
    removeStorageData("ACCESS_TOKEN")
    removeStorageData("ADMIN_USER")
  }

  return (
    <AuthContext.Provider value={{authData, userLogin, userLogout}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;



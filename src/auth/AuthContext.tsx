import React, {createContext, useState, useContext, useEffect} from 'react';
import {AuthContextData, UserData} from './types';

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider = ({children}: any) => {
  const [authData, setAuthData] = useState<UserData>();

  useEffect(() => {
    if (! authData) {
      // check if exits in storage
    }
  }, [])


  return (
    <AuthContext.Provider value={{authData, setAuthData}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;



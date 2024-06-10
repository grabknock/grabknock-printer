import { ReactNode, useMemo } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import authenticatedInstance from "./apiPrivateInstance";

const WithAxios = ({ children }: { children?: ReactNode }) => {
  useMemo(() => {
    authenticatedInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response) {
          if (error.response.status === 403) {
            AsyncStorage.clear();
            return Promise.reject(error);
          } else {
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );
  }, []);

  return <>{children}</>;
};

export default WithAxios;

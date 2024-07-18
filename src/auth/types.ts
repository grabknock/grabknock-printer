import { Dispatch, SetStateAction } from "react";

export type AuthContextData = {
    authData?: UserData | null;
    //setAuthData?: Dispatch<SetStateAction<UserData | undefined>>;
    setAuthData?: any;
    userLogin: (data: UserData) => boolean;
    userLogout: () => void;
    //loading: boolean;
  };



export interface UserData {
    restaurant_id: string;
    device_platform: string;
    restaurant_name: string;
    user_id: string;
    first_name: string;
    last_name: string;
    email_address: string;
    user_source: string;
    phone_number: string;
    email_address_verification: boolean;
    phone_number_verification: boolean;
    role: string;
    avatar_url: string | null | undefined;
    is_notification_enabled: boolean;
    status: string;
    access_token: AccessToken;
    created_at: number;
    created_at_str: string;
    updated_at: number;
    updated_at_str: string;
  }
  
  export interface AccessToken {
    access_token: string;
    refresh_token: string;
    expiry_in_millis: number;
  }
  
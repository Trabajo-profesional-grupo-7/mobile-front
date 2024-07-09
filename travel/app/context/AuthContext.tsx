import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import LoadingIndicator from "@/components/LoadingIndicator";
import messaging from "@react-native-firebase/messaging";
import notifee from "@notifee/react-native";
interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (
    email: string,
    password: string,
    username: string,
    birth_date: string,
    preferences: string[],
    city: string
  ) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onRefreshToken?: () => Promise<any>;
  onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "my-jwt";
const REFRESH_TOKEN_KEY = "refresh-token";
export const API_URL = "https://api-gateway-e26h.onrender.com";
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [loading, setLoading] = useState(false);

  const [authState, setAuthState] = useState<{
    token: string | null;
    refresh_token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    refresh_token: null,
    authenticated: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      setLoading(true);
      let token = null;
      let refresh_token = null;
      try {
        token = await SecureStore.getItemAsync(TOKEN_KEY);
      } catch (e) {
        token = null;
      }
      try {
        refresh_token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      } catch (e) {
        refresh_token = null;
      }

      console.log("stored:", token);
      console.log("refresh:", refresh_token);
      if (token != null && refresh_token != null) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          await axios.get(`${API_URL}/users/verify_id_token`);
          router.replace("/(tabs)");
        } catch (e) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${refresh_token}`;
          console.log(axios.defaults.headers.common["Authorization"]);
          try {
            const result = await axios.post(`${API_URL}/users/refresh_token`);
            setAuthState({
              token: result.data.token,
              refresh_token: result.data.refresh_token,
              authenticated: true,
            });
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${result.data.token}`;
            try {
              await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
              await SecureStore.setItemAsync(
                REFRESH_TOKEN_KEY,
                result.data.refresh_token
              );
              console.log("Refreshed token");
              router.replace("/(tabs)");
            } catch (e) {
              alert(e);
            }
          } catch (e) {
            alert(e);
            setLoading(false);
          }
        }
      }
      setLoading(false);
    };
    loadToken();
  }, []);

  const register = async (
    email: string,
    password: string,
    username: string,
    birth_date: string,
    preferences: string[],
    city: string
  ) => {
    await messaging().registerDeviceForRemoteMessages();

    const token = await messaging().getToken();
    
    async function onMessageReceived(message: any) {
      const channelId = await notifee.createChannel({
        id: "default",
        name: "Default Channel",
      });
  
      notifee.displayNotification({
        title: message.notification.title,
        body: message.notification.body,
        android: {
          channelId,
        },
      });
    }
  
    messaging().onMessage(onMessageReceived);

    console.log(`${API_URL}/users/signup`);
    try {
      return await axios.post(`${API_URL}/users/signup`, {
        username: username,
        email: email,
        password: password,
        preferences: preferences,
        birth_date: birth_date,
        city: city,
        fcm_token: token,
      });
    } catch (e) {
      return { error: true, code: (e as any).response.status };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });
      setAuthState({
        token: result.data.token,
        refresh_token: result.data.refresh_token,
        authenticated: true,
      });

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${result.data.token}`;

      try {
        await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
        await SecureStore.setItemAsync(
          REFRESH_TOKEN_KEY,
          result.data.refresh_token
        );
      } catch (e) {
        console.log(e);
      }

      return result;
    } catch (e) {
      return { error: true, msg: (e as any).response.data };
    }
  };

  const refreshToken = async () => {
    try {
      await axios.get(`${API_URL}/users/verify_id_token`);
    } catch (e) {
      try {
        const refresh_token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${refresh_token}`;
        const result = await axios.post(`${API_URL}/users/refresh_token`);
        setAuthState({
          token: result.data.token,
          refresh_token: result.data.refresh_token,
          authenticated: true,
        });
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${result.data.token}`;
        await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
        await SecureStore.setItemAsync(
          REFRESH_TOKEN_KEY,
          result.data.refresh_token
        );
        console.log("Refreshed token");
      } catch (e) {
        console.log(e);
      }
    }
    return;
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);

    axios.defaults.headers.common["Authorization"] = "";

    setAuthState({
      token: null,
      refresh_token: null,
      authenticated: false,
    });
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    onRefreshToken: refreshToken,
    authState,
  };

  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
      {loading && <LoadingIndicator />}
    </>
  );
};

import { createContext, useContext, useEffect, useState } from 'react'; import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';


interface AuthProps {
    authState?: { token: string | null; authenticated: boolean | null };
    onRegister?: (email: string, password: string, username:string, birth_date:string, preferences:string[]) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onRefreshToken?: () => Promise<any>;
    onLogout?: () => Promise<any>;
}


const TOKEN_KEY = "my-jwt";
const REFRESH_TOKEN_KEY = "refresh-token";
export const API_URL = "http://18.191.176.137:8001";
const AuthContext = createContext<AuthProps>({});


export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({children}: any) => {
    const [authState, setAuthState] = useState<{
        token: string | null;
        refresh_token: string | null;
        authenticated: boolean | null;
    }>({
        token: null,
        refresh_token: null,
        authenticated:null,
    })

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            const refresh_token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
            console.log("stored:", token);
            console.log("refresh:", refresh_token);

            if (token != null && refresh_token != null) {
                axios.defaults.headers.common['Authorization'] =  `Bearer ${token}`;
                try {
                    await axios.get(`${API_URL}/users/verify_id_token`);
                    router.replace("/(tabs)")
                } catch (e) {
                    axios.defaults.headers.common['Authorization'] =  `Bearer ${refresh_token}`;
                    console.log(axios.defaults.headers.common['Authorization'])
                    try {
                        const result = await axios.post(`${API_URL}/users/refresh_token`);
                        setAuthState({
                            token: result.data.token,
                            refresh_token: result.data.refresh_token,
                            authenticated:true,
                        });
                        axios.defaults.headers.common['Authorization'] =  `Bearer ${result.data.token}`;
                        await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
                        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, result.data.refresh_token);
                        console.log("Refreshed token")
                        router.replace("/(tabs)")
                    } catch (e) {
                        console.log(e)
                    }
                }
            }
        }
        loadToken();
    }, []);

    const register = async (email:string, password:string, username:string, birth_date:string, preferences:string[]) => {
        console.log(`${API_URL}/users/signup`)
        console.log(`${username},${email},${password},${preferences},${birth_date}`)
        try {
            return await axios.post(`${API_URL}/users/signup`,{
                "username": username, 
                "email": email, 
                "password": password, 
                "preferences": preferences,
                "birth_date": birth_date, 
            });
        } catch (e) {
            return {error:true, msg: (e as any).response.data.msg};
        }
    }

    const login = async (email:string, password:string) => {
        try {
            const result = await axios.post(`${API_URL}/users/login`,{email, password});
            setAuthState({
                token: result.data.token,
                refresh_token: result.data.refresh_token,
                authenticated:true,
            });

            axios.defaults.headers.common['Authorization'] =  `Bearer ${result.data.token}`;

            await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
            await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, result.data.refresh_token);

            
            return result;

        } catch (e) {
            return {error:true, msg: (e as any).response.data};
        }
    }

    const refreshToken = async () => {
        try {
            await axios.get(`${API_URL}/users/verify_id_token`);
        } catch (e) {
            axios.defaults.headers.common['Authorization'] =  `Bearer ${authState.refresh_token}`;
            try {
                const result = await axios.post(`${API_URL}/users/refresh_token`);
                setAuthState({
                    token: result.data.token,
                    refresh_token: result.data.refresh_token,
                    authenticated:true,
                });
                axios.defaults.headers.common['Authorization'] =  `Bearer ${result.data.token}`;
                await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
                await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, result.data.refresh_token);
                console.log("Refreshed token")
            } catch (e) {
                console.log("a")
                console.log(e)
            }
        }
        return
    }

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);

        axios.defaults.headers.common['Authorization'] = "";

        setAuthState({
            token:null,
            refresh_token:null,
            authenticated:false,
        });
    }

    const value =  {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        onRefreshToken: refreshToken,
        authState
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};






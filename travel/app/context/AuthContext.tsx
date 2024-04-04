import { createContext, useContext, useEffect, useState } from 'react'; import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';


interface AuthProps {
    authState?: { token: string | null; authenticated: boolean | null };
    onRegister?: (email: string, password: string, username:string, birth_date:string, preferences:string[]) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}


const TOKEN_KEY = "my-jwt";
export const API_URL = "https://api-gateway-e26h.onrender.com";
const AuthContext = createContext<AuthProps>({});


export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({children}: any) => {
    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | null;
    }>({
        token: null,
        authenticated:null,
    })

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            console.log("stored:", token);

            if (token) {
                axios.defaults.headers.common['Authorization'] =  `Bearer ${token}`;
                setAuthState({
                    token: token,
                    authenticated:true,
                });
                router.replace("/(tabs)")
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
                authenticated:true,
            });

            axios.defaults.headers.common['Authorization'] =  `Bearer ${result.data.token}`;

            await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);

            
            return result;

        } catch (e) {
            return {error:true, msg: (e as any).response.data};
        }
    }

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);

        axios.defaults.headers.common['Authorization'] = "";

        setAuthState({
            token:null,
            authenticated:false,
        });
    }

    const value =  {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};






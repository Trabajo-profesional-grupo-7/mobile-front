import { createContext, useContext, useEffect, useState } from 'react'; import axios from 'axios';
import * as SecureStore from 'expo-secure-store';


interface AuthProps {
    authState?: { token: string | null; authenticated: boolean | null };
    onRegister?: (email: string, password: string) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}


const TOKEN_KEY = "my-jwt";
export const API_URL = "http://18.191.176.137:8001/";
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

    const value =  {};

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};






import { ReactNode, createContext, useContext, useState } from "react";

interface AuthContextProps {
    token: string | null;
    login: (newToken: string) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuth = () => useContext(AuthContext); //Custom hook to get the context

export const AuthProvider: React.FC<{ children: ReactNode }> = ({children}) => { 

    const [token, setToken] = useState<string | null>(localStorage.getItem('userToken')); //Init token with localStorage value

    //Login function
    const login = (newToken: string) => {
        localStorage.setItem('userToken', newToken);
        setToken(newToken);
    }

    //Logout function
    const logout = () => {
        localStorage.removeItem('userToken');
        setToken(null);
    }

    //isAuthenticated function
    const isAuthenticated = () => {
        return token !== null; //Return true if token is not null
    }

    return (
        <AuthContext.Provider value={{token, login, logout, isAuthenticated}}>
            {children}
        </AuthContext.Provider>
    )
}
import { ReactNode, createContext, useContext, useState } from "react";
import { jwtDecode } from 'jwt-decode';

interface AuthContextProps {
    token: string | null,
    userId: number | null,
    login: (newToken: string) => void,
    logout: () => void,
    isAuthenticated: () => boolean,
}

interface DecodedTokenProps {
    id: number; 
    firstname: string;
    lastname: string;
}

const AuthContext = createContext<AuthContextProps | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext); //Custom hook to get the context

export const AuthProvider: React.FC<{ children: ReactNode }> = ({children}) => { 

    //Get token from localStorage and decode it to get userId
    const storedToken = localStorage.getItem('userToken');
    let initialUserId = null;

    if (storedToken) {
        const decodedToken = jwtDecode<DecodedTokenProps>(storedToken);
        initialUserId = decodedToken.id;
    }

    const [token, setToken] = useState<string | null>(localStorage.getItem('userToken')); //Init token with localStorage value
    const [userId, setUserId] = useState<number | null>(initialUserId); //Init userId with localStorage value if token exists

    //Login function
    const login = (newToken: string) => {
        localStorage.setItem('userToken', newToken);
        setToken(newToken);

        //At login, decode token to get userId and set it in state
        const decodedToken: DecodedTokenProps = jwtDecode<DecodedTokenProps>(newToken);
        setUserId(decodedToken.id);
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
        <AuthContext.Provider value={{token, userId, login, logout, isAuthenticated}}>
            {children}
        </AuthContext.Provider>
    )
}
import { UsersType } from '@/components/UsersPage';
import { checkIfTokenExpired } from '@/utils/auth.util';
import { fetchApi } from '@/utils/fetch.util';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export type UserLoginType = {
    userId: string;
    username: string;
    lastName: string;
    firstName: string;
    position: string;
    isLoggedIn: boolean;
}
export type UserType = {
    userId: string;
    username: string;
    lastName: string;
    firstName: string;
    position: string;
    createdAt: string;
}

export type UserContextType = {
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    user: UserLoginType;
    setUser: React.Dispatch<React.SetStateAction<UserLoginType>>;
    users: UsersType[];
    setUsers: React.Dispatch<React.SetStateAction<UsersType[]>>;
    selectedUser: UserType | undefined
    setSelectedUser: React.Dispatch<React.SetStateAction<UserType | undefined>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
    const context = useContext<UserContextType | undefined>(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}

type UserProviderPropsType = {
    children: ReactNode;
};

export const UserProvider: React.FC<UserProviderPropsType> = ({ children }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<UserType | undefined>(undefined);
    const [user, setUser] = useState<UserLoginType>({
        userId: "",
        username: "",
        lastName: "",
        firstName: "",
        position: "",
        isLoggedIn: false
    })
    const [users, setUsers] = useState<UsersType[]>([]);
    const navigate = useNavigate();

    const contextValue: UserContextType = {
        isLoading, setIsLoading, user, setUser, users, setUsers, selectedUser, setSelectedUser
    }

    useEffect(() => {
        const checkUserLogin = async () => {
            try {
                setIsLoading(true);
                const request = await fetchApi("/auth/checkUserLogin", "POST");
    
                if (request.ok) {
                    const response = await request.json();
                    setUser({
                        userId: response.data.userId,
                        username: response.data.username,
                        lastName: response.data.lastName,
                        firstName: response.data.firstName,
                        position: response.data.position,
                        isLoggedIn: true
                    })
                }
            } catch (error) {
                console.log(error)
            } finally {
                setTimeout(() => {
                    setIsLoading(false)
                }, 3000)
            }
        }

        const isTokenExpired = checkIfTokenExpired();
        if (isTokenExpired) {
            setUser({
                userId: "",
                username: "",
                lastName: "",
                firstName: "",
                position: "",
                isLoggedIn: false,
            });
            setUsers([]);
            navigate("/login");
        } else {
            checkUserLogin();
        }

    },[])

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    )
}
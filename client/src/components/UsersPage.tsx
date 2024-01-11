import { useEffect, useState } from 'react'
import CustomTable from './CustomTable'
import { fetchApi } from '@/utils/fetch.util';
import { useUser } from '@/context/userContext';
import CreateUserDialog from './CreateUserDialog';
import { uniqBy } from 'lodash';
import { Button } from './ui/button';
import { checkIfTokenExpired } from '@/utils/auth.util';
import { useNavigate } from 'react-router-dom';
import UpdateUserDialog from './UpdateUserDialog';
import { useCookies } from "react-cookie";
import Spinner from './Spinner';

export type UsersType = {
    _id?: string;
    id?: number;
    number: number;
    userId: string;
    username: string;
    firstName: string;
    lastName: string;
    position: string;
    createdAt: string;
}

const UsersPage = () => {
    const { setIsLoading, user, setUser, isLoading } = useUser();
    const [users, setUsers] = useState<UsersType[]>([]);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [newUser, setNewUser] = useState<any>(undefined);
    const [updatedUser, setUpdateUser] = useState<any>(undefined);
    const [deleteUser, setDeleteUser] = useState<"" | undefined>(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        const handleUsers = async () => {
            try {
                setIsLoading(true);
                const request = await fetchApi("/user/getUsers", "GET");

                if (request.ok) {
                    const response = await request.json();
                    const countUsers = response.data.filter((u: UsersType) => u.userId !== user.userId).map((u: UsersType, index: number) => ({ id: index + 1, ...u }))

                    setTimeout(() => {
                        setUsers(countUsers);
                    }, 2000)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setTimeout(() => {
                    setIsLoading(false)
                }, 3000)
            }
        }

        handleUsers();
    }, [])

    useEffect(() => {
        if (user.isLoggedIn) {
            const ws = new WebSocket(import.meta.env.VITE_WEB_SOCKET_URL);
            setWs(ws);

            ws.addEventListener("message", (event) => {
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
                    const parsedData = JSON.parse(event.data);
                    if (parsedData.isNewUser) {
                        const wsNewUser = parsedData.newUserDetails;
                        setNewUser(wsNewUser);
                    } else if (parsedData.isUpdateUser) {
                        const wsUpdatedUser = parsedData.newUserDetails;
                        setUpdateUser(wsUpdatedUser);
                    } else if (parsedData.isDeleteUser) {
                        const wsDeleteUser = parsedData.newUserDetails;
                        setDeleteUser(wsDeleteUser);
                    }
                }

            });
        }
    }, [])

    useEffect(() => {
        if (updatedUser) {
            const updatedUsers = [...JSON.parse(JSON.stringify(users))].map((u: UsersType, index: number) => {
                if (u.userId === updatedUser.userId) {
                    const createdAt = u?.createdAt;
                    const number = u?.number;
                    u = { ...updatedUser, createdAt, number }
                }
                u.id = index + 1
                return u;
            })

            setUsers(updatedUsers);
            setUpdateUser(undefined);
        } else if (deleteUser) {
            const newSetUsers = [...JSON.parse(JSON.stringify(users))].filter((u: UsersType) => u.userId !== deleteUser);

            setUsers(newSetUsers);
            setDeleteUser(undefined);
        } else if (newUser) {
            const removeDuplicateUsers = uniqBy([...users, newUser], "userId");
            const countUsers = removeDuplicateUsers.map((u: UsersType, index: number) => ({ id: index + 1, ...u }))
            setNewUser(undefined)
            setUsers(countUsers)
        }
    }, [updatedUser, deleteUser, newUser]);

    return (
        <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl w-full container">
            <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl tracking-tight">Hi! <span className="font-bold">{user.firstName} {user.lastName}</span> </h1>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => {
                        const isTokenExpired = checkIfTokenExpired(true);
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
                        }
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                        </svg>
                    </Button>
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                        <p className="text-muted-foreground">Here's a list of the users</p>
                    </div>
                    <CreateUserDialog websocket={ws} />
                    <UpdateUserDialog websocket={ws} />
                </div>
                <div className="space-y-4">
                    {
                        isLoading ? <Spinner /> : <CustomTable users={users} websocket={ws} />
                    }
                </div>
            </div>
        </div>
    )
}

export default UsersPage
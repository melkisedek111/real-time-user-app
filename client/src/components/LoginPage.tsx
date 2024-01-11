import React, { useState } from 'react'

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { handleUserFormValue } from '@/helpers/form.helper'
import { fetchApi } from '@/utils/fetch.util'
import { useUser } from '@/context/userContext'
import { useNavigate } from 'react-router-dom'
import { toast } from './ui/use-toast'
import Cookies from "js-cookie";
import Spinner from './Spinner'

export type ValueFormType<T = string> = {
    value: T;
    message: string;
    isError: boolean;
    isRequired: boolean;
}

export type LoginValueType = {
    username: ValueFormType;
    password: ValueFormType;
}

const LoginPage = () => {

    const initialLoginValues = {
        username: {
            value: "",
            message: "Username is required.",
            isError: false,
            isRequired: true
        },
        password: {
            value: "",
            message: "Password is required.",
            isError: false,
            isRequired: true
        },
    }
    const [loginValues, setLoginValues] = useState<LoginValueType>(initialLoginValues);
    const { setIsLoading, setUser, isLoading } = useUser();
    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            setIsLoading(true);
            const username = loginValues.username.value
            const password = loginValues.password.value
            const request = await fetchApi("/auth/login", "POST", { username, password });

            const response = await request.json();
            if (request.ok) {
                Cookies.set("token", response.data.token);
                setTimeout(() => {
                    setUser({ ...response.data.user, isLoggedIn: true });
                    setLoginValues({ username: { ...loginValues.username, value: "" }, password: { ...loginValues.password, value: "" }, })
                    navigate('/dashboard');
                }, 2500)
            } else {
                toast({ variant: "destructive", description: response.message });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setTimeout(() => {
                setIsLoading(false)
            }, 2500)
        }
    }

    return (
        <Card className="w-[450px]">
            {
                isLoading ? <Spinner /> : <>
                    <CardHeader>
                        <CardTitle><h3 className="font-semibold tracking-tight text-2xl">Login your account</h3></CardTitle>
                        <CardDescription>Deploy your new project in one-click.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="username">Username</Label>
                                    <div>
                                        <Input id="username" name="username" placeholder="Your account username here." required={true} onChange={(event) => handleUserFormValue<LoginValueType>(event, loginValues, setLoginValues)} value={loginValues.username.value} />
                                        {
                                            loginValues.username.isError ? (<p className="text-red-500 text-xs mt-1">{loginValues.username.message}</p>) : null
                                        }
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="password">Password</Label>
                                    <div>
                                        <Input id="password" type="password" name="password" placeholder="Your account password here." required={true} onChange={(event) => handleUserFormValue<LoginValueType>(event, loginValues, setLoginValues)} value={loginValues.password.value} />
                                        {
                                            loginValues.username.isError ? (<p className="text-red-500 text-xs mt-1">{loginValues.username.message}</p>) : null
                                        }
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button onClick={handleLogin}>Login</Button>
                    </CardFooter>
                </>
            }

        </Card>
    )
}

export default LoginPage




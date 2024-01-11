import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserValueFormType, handlePositionChange, handleUserFormValue, initialUserFormValues } from '@/helpers/form.helper';
import { useUser } from '@/context/userContext';
import { fetchApi } from '@/utils/fetch.util';
import { checkIfTokenExpired } from '@/utils/auth.util';
import { useNavigate } from 'react-router-dom';

type RequestUserFormType = {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    position: string | number;
}

const CreateUserDialog = ({ websocket }: { websocket: WebSocket | null }) => {
    const initializeUserFormValues = JSON.parse(JSON.stringify({ ...initialUserFormValues }));
    const [userFormValues, setUserFormValues] = useState<UserValueFormType>(initializeUserFormValues);
    const { setIsLoading, setUser, setUsers } = useUser();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleCreateUser = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            setIsLoading(true);
            const hasError: boolean[] = [];
            const formValues = { ...userFormValues };
            const values: RequestUserFormType = {
                username: "",
                password: "",
                firstName: "",
                lastName: "",
                position: "",
            };
            for (const key in formValues) {
                const input = userFormValues[key as keyof UserValueFormType];

                if (input.isRequired) {
                    if (input.otherErrorMessage) {
                        input.otherErrorMessage.confirmPassword.isError = false;
                    }
                    if (!input.value) {
                        input.isError = true;

                        hasError.push(true);
                    } else if (key === "confirmPassword") {
                        const password = formValues.password.value;
                        const confirmPassword = input.value;
                        if (input.otherErrorMessage) {
                            if (confirmPassword !== password) {
                                input.isError = false;
                                input.otherErrorMessage.confirmPassword.isError = true;
                            } else {
                                input.otherErrorMessage.confirmPassword.isError = false;
                            }
                        }
                    }
                    else {
                        input.isError = false;
                    }
                }

                values[key as keyof RequestUserFormType] = input.value;
            }
            setUserFormValues(formValues);

            if (!hasError.length) {
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
                    const request = await fetchApi<RequestUserFormType>("/user/create", "POST", { ...values, position: Number(values.position) });
                    const response = await request.json();
                    if (request.ok) {

                        if (websocket) {
                            websocket.send(JSON.stringify({
                                isNewUser: true,
                                newUserDetails: response.data.user
                            }))
                        }
                        setUserFormValues(initializeUserFormValues);
                        document.getElementById('closeDialog')?.click();
                        toast({ description: response.message });
                    } else {
                        toast({ variant: "destructive", description: response.message });
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button id="openDialog" onClick={() => { setUserFormValues(initializeUserFormValues) }}>Create User</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[640px]">
                <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription>
                        Please fill up the fields to create a new User.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="order" className="text-right">
                            Username
                        </Label>
                        <div className="col-span-3" >
                            <Input id="username" name="username" value={userFormValues.username.value} placeholder="Type your username here." onChange={(event) => handleUserFormValue(event, userFormValues, setUserFormValues)} onKeyDown={(event) => {
                                if (event.key === ' ' || event.key === 'Spacebar') {
                                    // Prevent the default behavior (e.g., scrolling or triggering a click event)
                                    event.preventDefault();
                                }
                            }} />
                            {
                                userFormValues.username.isError ? (<p className="text-red-500 text-xs mt-1">{userFormValues.username.message}</p>) : null
                            }
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="order" className="text-right">
                            Password
                        </Label>
                        <div className="col-span-3" >
                            <Input id="password" name="password" value={userFormValues.password.value} placeholder="Type your password here." onChange={(event) => handleUserFormValue(event, userFormValues, setUserFormValues)} type="password" />
                            {
                                userFormValues.password.isError ? (<p className="text-red-500 text-xs mt-1">{userFormValues.password.message}</p>) : null
                            }
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="order" className="text-right">
                            Confirm Password
                        </Label>
                        <div className="col-span-3" >
                            <Input id="confirmPassword" name="confirmPassword" value={userFormValues.confirmPassword.value} placeholder="Type your confirm password here." onChange={(event) => handleUserFormValue(event, userFormValues, setUserFormValues)} type="password" />
                            {
                                userFormValues.confirmPassword.isError ? (<p className="text-red-500 text-xs mt-1">{userFormValues.confirmPassword.message}</p>) : null
                            }
                            {
                                userFormValues.confirmPassword?.otherErrorMessage?.confirmPassword.isError ? (<p className="text-red-500 text-xs mt-1">{userFormValues.confirmPassword.otherErrorMessage?.confirmPassword.message}</p>) : null
                            }
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="order" className="text-right">
                            First Name
                        </Label>
                        <div className="col-span-3" >
                            <Input id="firstName" name="firstName" value={userFormValues.firstName.value} placeholder="Type your firstName here." onChange={(event) => handleUserFormValue(event, userFormValues, setUserFormValues)} />
                            {
                                userFormValues.firstName.isError ? (<p className="text-red-500 text-xs mt-1">{userFormValues.firstName.message}</p>) : null
                            }
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="order" className="text-right">
                            Last Name
                        </Label>
                        <div className="col-span-3" >
                            <Input id="lastName" name="lastName" value={userFormValues.lastName.value} placeholder="Type your lastName here." onChange={(event) => handleUserFormValue(event, userFormValues, setUserFormValues)} />
                            {
                                userFormValues.lastName.isError ? (<p className="text-red-500 text-xs mt-1">{userFormValues.lastName.message}</p>) : null
                            }
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phase" className="text-right">
                            Position
                        </Label>
                        <div className="col-span-3">
                            <Select name="position" value={userFormValues.position.value} defaultValue={userFormValues.position.value} onValueChange={(value: string) => handlePositionChange(value, userFormValues, setUserFormValues)} >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a position here." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Positions</SelectLabel>
                                        <SelectItem value="10">Admin</SelectItem>
                                        <SelectItem value="1">Regular</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {
                                userFormValues.position.isError ? (<p className="text-red-500 text-xs mt-1">{userFormValues.position.message}</p>) : null
                            }
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" id="closeDialog">
                            Close
                        </Button>
                    </DialogClose>
                    <Button type="submit" onClick={handleCreateUser} >Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateUserDialog




import React, { useEffect, useState } from 'react'
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
import { handleUserFormValue } from '@/helpers/form.helper';
import { useUser } from '@/context/userContext';
import { fetchApi } from '@/utils/fetch.util';
import { checkIfTokenExpired } from '@/utils/auth.util';
import { useNavigate } from 'react-router-dom';

type RequestUserFormType = {
    userId?: string
    username: string;
    firstName: string;
    lastName: string;
    position: string | number;
}

type ValueFormType<T = string> = {
    value: T |undefined;
    message: string;
    isError: boolean;
    isRequired: boolean;
    otherErrorMessage?: {
        [key in string]: {
            message: string;
            isError: boolean;
        }
    }
}

export type UpdateUserValueFormType = {
    userId: ValueFormType;
    username: ValueFormType;
    firstName: ValueFormType;
    lastName: ValueFormType;
    position: ValueFormType;
}

const UpdateUserDialog = ({ websocket }: { websocket: WebSocket | null }) => {
    const { setIsLoading, setUser, setUsers, selectedUser, setSelectedUser } = useUser();
    const initialUserFormValues: UpdateUserValueFormType = {
        userId: {
            value: "",
            message: "",
            isError: false,
            isRequired: false
        },
        username: {
            value: "",
            message: "Username is required.",
            isError: false,
            isRequired: true
        },
        firstName: {
            value: "",
            message: "First name is required.",
            isError: false,
            isRequired: true
        },
        lastName: {
            value: "",
            message: "Last name is required.",
            isError: false,
            isRequired: true
        },
        position: {
            value: "",
            message: "Position is required",
            isError: false,
            isRequired: true
        },
    }
    const [userFormValues, setUserFormValues] = useState<UpdateUserValueFormType>(initialUserFormValues);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handlePositionChange = (value: string, userFormValues: UpdateUserValueFormType, setUserFormValues: React.Dispatch<React.SetStateAction<UpdateUserValueFormType>>) => {
        if(userFormValues.position){
            setUserFormValues({ ...userFormValues, position: { ...userFormValues.position, value } });
        }
    }

    const handleCreateUser = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            setIsLoading(true);
            const hasError: boolean[] = [];
            const formValues = { ...userFormValues };
            const values: RequestUserFormType = {
                username: "",
                firstName: "",
                lastName: "",
                position: "",
            };
            for (const key in formValues) {
                const input = userFormValues[key as keyof UpdateUserValueFormType];

                if (input.isRequired) {
                    if (!input.value) {
                        input.isError = true;

                        hasError.push(true);
                    } else {
                        input.isError = false;
                    }
                }

                if(input.value){
                    values[key as keyof RequestUserFormType] = input.value;
                }
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
                    const request = await fetchApi<RequestUserFormType>("/user/updateUser", "POST", { ...values, userId: selectedUser?.userId, position: Number(values.position) });

                    const response = await request.json();
                    if (request.ok) {
                        if (websocket) {
                            websocket.send(JSON.stringify({
                                isUpdateUser: true,
                                newUserDetails: response.data.user
                            }))
                        }
                        setSelectedUser(undefined);
                        document.getElementById('closeUpdateDialog')?.click();
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

    useEffect(() => {
        const itemValues = JSON.parse(JSON.stringify(initialUserFormValues))
        if(selectedUser) {
            for(const key in itemValues) {
                if(key in selectedUser) {
                    itemValues[key as keyof UpdateUserValueFormType].value = selectedUser[key as keyof UpdateUserValueFormType];
                }
            }
            setUserFormValues(itemValues)
        }
    }, [selectedUser])

    return (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(undefined)}>
            <DialogContent className="sm:max-w-[640px]">
                <DialogHeader>
                    <DialogTitle>Update User</DialogTitle>
                    <DialogDescription>
                        Please fill up the fields to update the User.
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
                            <Select name="position" value={userFormValues.position.value?.toString()} defaultValue={userFormValues.position.value?.toString()} onValueChange={(value: string) => handlePositionChange(value, userFormValues, setUserFormValues)} >
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
                        <Button type="button" variant="secondary" id="closeUpdateDialog">
                            Close
                        </Button>
                    </DialogClose>
                    <Button type="submit" onClick={handleCreateUser} >Update</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateUserDialog




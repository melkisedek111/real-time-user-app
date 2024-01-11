export type ValueFormType<T = string> = {
    value: T;
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

export type UserValueFormType = {
    _id: ValueFormType;
    username: ValueFormType;
    password: ValueFormType;
    confirmPassword: ValueFormType;
    firstName: ValueFormType;
    lastName: ValueFormType;
    position: ValueFormType;
}

export const initialUserFormValues: UserValueFormType = {
    _id: {
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
    password: {
        value: "",
        message: "Password is required.",
        isError: false,
        isRequired: true
    },
    confirmPassword: {
        value: "",
        message: "Confirm password is required.",
        isError: false,
        isRequired: true,
        otherErrorMessage: {
            confirmPassword: {
                message: "Confirm password does not matched!",
                isError: false,
            }
        }
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

export const handleUserFormValue = <T extends {} = UserValueFormType>(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, 
    userFormValues: T, 
    setUserFormValues: React.Dispatch<React.SetStateAction<T>>) => {
    const name = event.target.name;
    if (name in userFormValues) {
        const value = event.target.value;
        setUserFormValues({
        ...userFormValues,
        [name]: { ...userFormValues[name as keyof T], value },
        });
    }
}

export const handlePositionChange = (value: string, userFormValues: UserValueFormType, setUserFormValues: React.Dispatch<React.SetStateAction<UserValueFormType>>) => {
    if(userFormValues.position){
        setUserFormValues({ ...userFormValues, position: { ...userFormValues.position, value } });
    }
}

export const handleNumericInputChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);

    // Allow only numbers (0-9) and specific control keys like backspace, delete, arrows, etc.
    const allowedKeys = /[0-9\b]/;

    if (!allowedKeys.test(keyValue)) {
        event.preventDefault();
    }
}
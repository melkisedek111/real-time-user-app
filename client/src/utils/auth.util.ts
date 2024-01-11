// authUtils.js
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const checkIfTokenExpired = (isLogout: boolean = false) => {
	const token = Cookies.get("token");
    console.log({token})
    if(isLogout) {
        Cookies.remove("token");
        return true;
    }

    if (token) {
        const decodedToken = jwtDecode(token);
		const currentTime = Date.now() / 1000; // Convert to seconds
        if(decodedToken.exp){
            return decodedToken.exp < currentTime; // Check if token has expired
        }
	}

    Cookies.remove("token");
	return true; // No token or token is invalid
};

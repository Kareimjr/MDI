import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
            console.log("Auth State Data:", data);
            if (data.success) {
                setIsLoggedin(true);
                await getUserData();
            } else {
                setIsLoggedin(false);
                setUserData(null);
            }
        } catch (error) {
            console.error("Error fetching auth state:", error.message);
            setIsLoggedin(false);
            setUserData(null);
        } finally {
            setIsLoading(false);
        }
    };

    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/data');
            console.log("User Data:", data);
            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
                setUserData(null);
            }
        } catch (error) {
            console.error("Error fetching user data:", error.message);
            setUserData(null);
        }
    };

    useEffect(() => {
        getAuthState();
    }, []);

    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        isLoading, 
        getUserData, getAuthState,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

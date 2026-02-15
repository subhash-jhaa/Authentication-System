import React, { useEffect } from 'react';
import {createContext , useState} from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

axios.defaults.withCredentials = true;

export const AppContext = React.createContext();

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true;

    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);

    const getAuthState = async () => {
        try {
            const {data} = await axios.get(backendURL + '/api/auth/is-auth');

            if (data.success){
                setIsLoggedIn(true);
                getUserData();
            }

        } catch (error) {
            // 401 is expected when not logged in, don't show error
        }
    }

    const getUserData = async () => {
        try {
            const {data} = await axios.get(`${backendURL}/api/user/data`);
            data.success ? setUserData(data.data) : toast.error(data.message);


        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        getAuthState();

    }, []);

    const value = {
        backendURL,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData
    };


    return (
        <AppContext.Provider value={value}>   
            {props.children}
        </AppContext.Provider>
    )
}
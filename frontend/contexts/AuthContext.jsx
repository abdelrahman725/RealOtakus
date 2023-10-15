"use client"

import { useEffect, useState, createContext, useContext } from 'react';
import { VerifyToken, RefreshToken } from '@/components/utils/authrequests';
import ConsoleLog from '@/components/utils/custom_console';
import LoadingSpinner from '@/components/spinner';
export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [IsAuthenticated, SetIsAuthenticated] = useState(null);
    const [error, set_error] = useState()

    useEffect(() => {
        (async () => {

            const verify_access_res = await VerifyToken();
            if (verify_access_res === null) {
                set_error(true)
                return
            }

            // access token has been sent and it's valid (not expired)
            if (verify_access_res.status_code === 200) {
                SetIsAuthenticated(true)
                ConsoleLog("access token is valid")
                return
            }

             // no access token is sent (always the case on first visit, or when the cookie expires)
             if (verify_access_res.status_code === 400) {
                SetIsAuthenticated(false)
                ConsoleLog("no access token is sent")
                return
            }

            // access token has expired, so hit refresh endpoint
            if (verify_access_res.status_code === 401) {
                ConsoleLog("access token has expired")

                const refresh_res = await RefreshToken()

                if (refresh_res === null) {
                    set_error(true)
                    return
                }

                // new access token is issued 
                if (refresh_res.status_code == 200) {
                    SetIsAuthenticated(true)
                    ConsoleLog("new access token is issued")
                }
                // refresh token has expired
                else {
                    SetIsAuthenticated(false)
                    ConsoleLog("refresh token expired, login again needed")
                }
                return
            }

            SetIsAuthenticated(false)
        })();
    }, [])

    return (
        <AuthContext.Provider
            value={{
                IsAuthenticated,
                SetIsAuthenticated,
            }}
        >
            {IsAuthenticated === null ? <LoadingSpinner error={error} /> : children}
        </AuthContext.Provider>
    );
};

export function useAuthContext() {
    const context = useContext(AuthContext)
    return context
}
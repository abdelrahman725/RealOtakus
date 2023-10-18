"use client";

import { useEffect, useState, createContext, useContext } from 'react';
import { VerifyToken, RefreshToken } from '@/components/utils/authrequests';
import { BACKEND_API } from '@/components/utils/constants';
import LoadingSpinner from '@/components/spinner';
import ConsoleLog from '@/components/utils/custom_console';
import { usePathname } from 'next/navigation';

const GlobalContext = createContext()

export const GlobalProvider = ({ children }) => {
    const [QuizStarted, SetQuizStarted] = useState(null);
    const [User, SetUser] = useState(null);
    const [IsReviewer, SetIsReviewer] = useState(null);
    const [IsAuthenticated, SetIsAuthenticated] = useState(null);
    const [error, set_error] = useState()
    const pathname = usePathname();

    useEffect(() => {

        (async () => {
            if (pathname === "/auth/google") {
                return
            }

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

            // no access token is sent (always the case on first visit or when the cookie itself expires)
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

    useEffect(() => {
        async function fetch_reviwer_state() {
            try {
                const response = await fetch(`${BACKEND_API}/review-contributions/?inquiry=true`, {
                    credentials: "include",
                    headers: {
                        "Content-type": "application/json",
                    },
                })
                if (response.status === 200) {
                    const result = await response.json()
                    SetIsReviewer(result === true)
                }
            }

            catch (error) {
                ConsoleLog(error)
            }
        }

        IsAuthenticated && fetch_reviwer_state()

        if (IsAuthenticated === false) {
            SetIsReviewer(false)
            localStorage.removeItem("contribution")
            localStorage.removeItem("anime")
        }

    }, [IsAuthenticated])

    return (
        <GlobalContext.Provider
            value={{
                IsAuthenticated,
                User,
                QuizStarted,
                IsReviewer,
                SetIsAuthenticated,
                SetQuizStarted,
                SetUser
            }}
        >
            {pathname === "/auth/google" ? children : IsAuthenticated === null ? <LoadingSpinner error={error} /> : children}

        </GlobalContext.Provider>
    );
};

export function useGlobalContext() {
    const context = useContext(GlobalContext)
    return context
}

export function useAuthContext() {
    const context = useContext(GlobalContext)
    return context
}
"use client";

import { useState, createContext, useContext } from 'react';
import { useAuthContext } from './AuthContext';
import { BACKEND_API } from '@/components/utils/constants';
import { useEffect } from 'react';
import ConsoleLog from '@/components/utils/custom_console';
const GlobalContext = createContext()

export const GlobalProvider = ({ children }) => {
    const { IsAuthenticated } = useAuthContext()
    const [QuizStarted, SetQuizStarted] = useState(null);
    const [User, SetUser] = useState(null);
    const [IsReviewer, SetIsReviewer] = useState(null);

    useEffect(() => {
        async function fetch_reviwer_state() {
            try {
                const response = await fetch(`${BACKEND_API}/review-contributions/?inquiry=true`, {
                    credentials: "include",
                    headers: {
                        "Content-type": "application/json",
                    },
                })
                const result = await response.json()
                SetIsReviewer(result)
            }

            catch (error) {
                ConsoleLog(error)
            }
        }

        IsAuthenticated && fetch_reviwer_state()

        if (IsAuthenticated === false) {
            localStorage.removeItem("contribution")
            localStorage.removeItem("anime")
        }

    }, [IsAuthenticated])

    return (
        <GlobalContext.Provider
            value={{
                User,
                QuizStarted,
                IsReviewer,
                SetQuizStarted,
                SetUser
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export function useGlobalContext() {
    const context = useContext(GlobalContext)
    return context
}

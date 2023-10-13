"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from 'react-toastify';
import { useAuthContext } from "@/contexts/AuthContext";
import { GoogleAuthenticate } from "@/components/utils/authrequests";

export default function Page() {
    const router = useRouter()
    const { SetIsAuthenticated } = useAuthContext()
    const searchParams = useSearchParams()

    useEffect(() => {
        (async () => {
            const state = searchParams.get("state")
            const code = searchParams.get("code")

            if (state && code) {
                const google_authenticate_res = await GoogleAuthenticate(state, code)

                if (google_authenticate_res.status_code === 201) {
                    SetIsAuthenticated(true)
                    toast.success("Logged In")
                }

                if (google_authenticate_res.status_code === 400) {
                    toast.error("Error")
                    router.replace("/auth/login")
                }

                if (google_authenticate_res.status_code === 409) {
                    toast.error("Email already in use")
                    router.replace("/auth/login")
                }
            }

            else {
                toast.error("Invalid url")
                router.replace("/auth/login")
            }
        })();
    }, [])

    return (
        <div className="centered">
            loading...
        </div>
    );
}
"use client"

import RequireAuthentication from "@/components/utils/requireauthentication";
import { useAuthContext } from '@/contexts/GlobalContext'
import { toast } from "react-toastify";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { AUTH_API } from "@/components/utils/constants";
import ConsoleLog from "@/components/utils/custom_console";
import Link from "next/link";

export default function Page() {

    const { SetIsAuthenticated } = useAuthContext()
    const [loading, set_loading] = useState(false)

    const log_user_out = async () => {

        set_loading(true)

        try {
            const result = await fetch(`${AUTH_API}/logout/`, {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-type': 'application/json',
                },
            })

            if (result.status === 204 || result.status === 401) {
                SetIsAuthenticated(false)
                toast.info("Signed Out")
                set_loading(false)
                return
            }
            else {
                toast.info("Error! logging out")
            }

        }
        catch (error) {
            ConsoleLog(error)
        }

        set_loading(false)
    }


    return (
        <RequireAuthentication>
            <div className="settings centered">

                <button onClick={log_user_out} className="logout_btn" disabled={loading}>
                    <span>Logout</span><FiLogOut className="icon" />
                </button>

                <div>
                    <Link href="/danger" className="danger_page_link"> got to danger zone</Link>
                </div>
            </div>
        </RequireAuthentication>
    )
}


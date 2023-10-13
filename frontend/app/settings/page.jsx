"use client"

import RequireAuthentication from "@/components/utils/requireauthentication";
import { useAuthContext } from '@/contexts/AuthContext'
import { toast } from "react-toastify";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import ReAuthorizedApiRequest from "@/components/utils/generic_request";
import Link from "next/link";

export default function Page() {

    const { SetIsAuthenticated } = useAuthContext()
    const [loading, set_loading] = useState(false)

    const log_user_out = async () => {

        set_loading(true)
        const result = await ReAuthorizedApiRequest({ path: "auth/logout/", method: "POST" })
        set_loading(false)

        if (result === null) {
            return
        }

        if (result.status_code === 204 || result.status_code === 401) {
            toast.info("Signed Out")
            SetIsAuthenticated(false)
            return
        }

        toast.info("Error! Try again")
    }


    return (
        <RequireAuthentication>
            <div className="settings centered">

                <button onClick={log_user_out} className="logout_btn">
                    <span>Logout</span><FiLogOut className="icon" />
                </button>

                <div>
                    <Link href="/danger" className="danger_page_link"> got to danger zone</Link>
                </div>
            </div>
        </RequireAuthentication>
    )
}


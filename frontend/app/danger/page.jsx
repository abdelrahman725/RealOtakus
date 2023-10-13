"use client"

import RequireAuthentication from "@/components/utils/requireauthentication";
import { useAuthContext } from '@/contexts/AuthContext'
import { toast } from "react-toastify";
import { useState } from "react";
import ReAuthorizedApiRequest from "@/components/utils/generic_request";

export default function Page() {

    const { SetIsAuthenticated } = useAuthContext()
    const [user_confirmed_text, set_user_confirmed_text] = useState()
    const [deletion_form, set_deletion_form] = useState(false)
    const [loading, set_loading] = useState(false)
    const CONFIRMATION_TEXT = "I understand and wish to proceed"

    const delete_account = async (submit_event) => {
        submit_event.preventDefault()

        set_loading(true)
        const result = await ReAuthorizedApiRequest({ path: "auth/delete/", method: "DELETE" })
        set_loading(false)

        if (result === null) {
            return
        }

        if (result.status_code === 204) {
            toast.info("your account is deleted")
            SetIsAuthenticated(false)
            return
        }

        toast.info("Error! Try again")
    }

    return (
        <RequireAuthentication>
            <div className="danger centered">
                <h1>Danger Zone</h1>
                <button onClick={() => set_deletion_form(prev => !prev)}>
                    Delete your account
                </button>

                {deletion_form &&
                    <form onSubmit={delete_account}>
                        <p>Please type <strong>"{CONFIRMATION_TEXT}"</strong> to confirm.</p>

                        <input
                            type="text"
                            autoComplete="off"
                            maxLength={CONFIRMATION_TEXT.length}
                            onChange={(e) => set_user_confirmed_text(e.target.value)}
                            value={user_confirmed_text}
                        />

                        <button type="submit" disabled={user_confirmed_text !== CONFIRMATION_TEXT}>Delete</button>

                        <p>You can't undo this action!</p>
                    </form>
                }

            </div>
        </RequireAuthentication>
    )
}


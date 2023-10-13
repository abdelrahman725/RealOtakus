"use client"

import { ConfirmPasswordReset } from "@/components/utils/authrequests";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { toast } from 'react-toastify';

export default function Page({ params }) {

    const router = useRouter();
    const { uid, token } = params;

    const [loading, set_loading] = useState(false)
    const [new_password, set_new_password] = useState("")
    const [re_new_password, set_re_new_password] = useState("")
    const re_password_ref = useRef(null)

    const confirm_password_reset = async (submit_event) => {
        submit_event.preventDefault()

        if (new_password !== re_new_password) {
            toast.error("passwords should match", { toastId: "match" })
            re_password_ref.current.style.outlineColor = "red"
            re_password_ref.current.focus()
            return
        }

        set_loading(true)
        const result = await ConfirmPasswordReset(uid, token, new_password)

        set_loading(false)
        set_new_password("")
        set_re_new_password("")

        if (result.status_code === 204) {
            toast.success("password is reseted successfully")
            router.replace("/auth/login")
            return
        }
        toast.error("invalid request")
    }

    return (
        <div className="password-reset">
            <h1>Set new password</h1>
            <form onSubmit={confirm_password_reset} className="base_form">
                <input
                    required
                    placeholder="new password"
                    name="password"
                    type="password"
                    value={new_password}
                    onChange={(e) => set_new_password(e.target.value)}
                />
                <input
                    required
                    placeholder="confirm new password"
                    name="re_password"
                    type="password"
                    value={re_new_password}
                    onChange={(e) => { set_re_new_password(e.target.value); e.target.style.outlineColor = "" }}
                    ref={re_password_ref}
                />

                {!loading ? <button type="submit">confirm</button> : "loading"}
            </form>
        </div>
    )
}

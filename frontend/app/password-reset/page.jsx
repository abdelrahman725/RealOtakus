"use client"

import { EmailForPasswordReset } from "@/components/utils/authrequests";
import { toast } from 'react-toastify';
import { useState } from "react";
import ConsoleLog from '@/components/utils/custom_console';

// export const metadata = {
//     title: 'RealOtakus | Password Reset',
//     description: 'RealOtakus password reset page',
// };

export default function Page() {

    const [loading, set_loading] = useState(false)
    const [email, set_email] = useState("")

    const send_email = async (submit_event) => {
        submit_event.preventDefault()

        set_loading(true)
        const result = await EmailForPasswordReset(email)
        set_loading(false)

        ConsoleLog(result)

        if (result.status_code === 204) {
            toast.success("Request is sent, check your email")
            set_email("")
        }
    }

    return (
        <div className="password-reset">
            <h1>password reset</h1>
            <form onSubmit={send_email} className="base_form">
                <input
                    placeholder="enter you Email address"
                    required
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => set_email(e.target.value)}
                />
                {!loading ? <button type="submit">request password reset</button> : "loading"}
            </form>
        </div>
    )
}

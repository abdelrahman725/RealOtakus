"use client"

import Link from "next/link"
import { toast } from "react-toastify"
import { Login } from "@/components/utils/authrequests"
import { useAuthContext } from "@/contexts/GlobalContext"
import { useState } from "react"
import GoogleButton from "@/components/socialbutton";
import ConsoleLog from '@/components/utils/custom_console';

export default function Page() {

    const { SetIsAuthenticated } = useAuthContext()
    const [loading, set_loading] = useState(false)
    const [login_data, set_login_data] = useState({
        email: "",
        password: ""
    })

    const on_formchange = (e) => {
        const { name, value } = e.target
        set_login_data(prev => ({ ...prev, [name]: value }))
    }

    const login_user = async (submit_event) => {
        if (loading === true) {
            return
        }
        submit_event.preventDefault()

        set_loading(true)
        const login_res = await Login(login_data.email, login_data.password)
        set_loading(false)

        ConsoleLog(login_res)

        if (login_res.status_code === 200) {
            SetIsAuthenticated(true)
            toast.success("Logged In")
            return
        }

        if (login_res.status_code === 401) {
            toast.error("User Not Found")
        }
    }

    return (
        <div className="auth_page">
            <h1>welcome again otaku</h1>

            {/* <GoogleButton /> */}

            <form onSubmit={login_user} className="base_form">
                <input
                    name="email"
                    type="email"
                    required
                    placeholder="email"
                    onChange={on_formchange}
                    value={login_data.email}
                />

                <span><Link href="/password-reset" className="forgot_password" shallow>Forgot password ?</Link></span>

                <input
                    name="password"
                    type="password"
                    required
                    placeholder="password"
                    onChange={on_formchange}
                    value={login_data.password}
                />

                <div className="fixed_height_container">
                    {loading ?
                        <div>loading</div>
                        :
                        <button type="submit" className="submit_btn" >
                            Sign In
                        </button>
                    }
                </div>
            </form>

            <p>new here ? &nbsp;<Link href="/auth/register" shallow>Sign up</Link></p>
        </div>
    )
}


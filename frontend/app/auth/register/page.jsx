"use client"

import { Register } from '@/components/utils/authrequests'
import { toast } from 'react-toastify';
import { useState, useRef, useEffect } from 'react'
import ConsoleLog from '@/components/utils/custom_console';
import GoogleButton from "@/components/socialbutton";
import { ResendActivationEmail } from '@/components/utils/authrequests';
import Link from 'next/link'

export default function Page() {

    const [loading, set_loading] = useState()
    const [email, set_email] = useState("")
    const [resend_email, set_resend_email] = useState(false)
    const [register_data, set_register_data] = useState({
        email: "",
        username: "",
        password: "",
        re_password: ""
    })
    const re_password_ref = useRef(null)
    const username_ref = useRef(null)
    const email_ref = useRef(null)

    const check_passwords_match = () => {
        if (register_data.password === "") {
            re_password_ref.current.style.outlineColor = ""
            return
        }

        if (register_data.password === register_data.re_password) {
            re_password_ref.current.style.outlineColor = "green"
            return
        }
        re_password_ref.current.style.outlineColor = "red"
    }

    const handle_short_username = (e) => {
        const length = e.target.value.length

        if (length < 5 || length > 20) {
            e.target.setCustomValidity("username must be 5 to 20 characters length");
            return
        }

        e.target.setCustomValidity("");
    }

    const on_formchange = (e) => {
        const { name, value } = e.target
        set_register_data(prev => ({ ...prev, [name]: value }))
    }

    const resend_activation_email = async () => {
        const result = await ResendActivationEmail(email)

        ConsoleLog(result)

        if (result.status_code === 204) {
            toast.success("Email is resent", { position: "top-center" })
            return
        }
        toast.error("Error sending email", { position: "top-center" });
    }

    const register_user = async (submit_event) => {
        submit_event.preventDefault()

        if (loading === true) {
            return
        }

        if (register_data.password !== register_data.re_password) {
            re_password_ref.current.focus()
            return
        }

        set_loading(true)
        const result = await Register(
            register_data.email,
            register_data.username,
            register_data.password
        )
        set_loading(false)

        ConsoleLog(result.res_data)

        if (result.status_code === 201) {
            toast.success("Please check your email to activate your account", { autoClose: false })
            document.activeElement.blur()
            set_email(register_data.email)
            set_register_data({
                email: "",
                username: "",
                password: "",
                re_password: ""
            })
            //setTimeout(() => { set_resend_email(true) }, 10000)
            return
        }
        
        if (result.status_code === 400) {
            if ("email" in result.res_data) {
                toast.error("Email address is not available", { position: "top-center" });
                email_ref.current.focus()
                return
            }
            if ("username" in result.res_data) {
                toast.error("Username is not available", { position: "top-center" });
                username_ref.current.focus()
                return
            }
            if ("password" in result.res_data) {
                toast.error(result.res_data["password"][0], { position: "top-center" });
                return
            }
        }
        toast.error("Error", { position: "top-center" });
    }

    useEffect(check_passwords_match, [register_data.password, register_data.re_password])

    return (
        <div className="auth_page">

            {resend_email && <button onClick={resend_activation_email}>resend email ?</button>}

            <h1>become a real otaku</h1>

            {/* <GoogleButton /> */}

            <form onSubmit={register_user} className="base_form">
                <input
                    name="username"
                    type="text"
                    placeholder="username"
                    required
                    onChange={(e) => { on_formchange(e); handle_short_username(e) }}
                    value={register_data.username}
                    ref={username_ref}
                />

                <input
                    name="email"
                    type="email"
                    placeholder="email"
                    required
                    onChange={on_formchange}
                    value={register_data.email}
                    ref={email_ref}
                />

                <input
                    name="password"
                    type="password"
                    placeholder="password"
                    required
                    autoComplete="new-password"
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    title="Must contain at least one number, one uppercase and one lowercase letter, and at least 8 characters"
                    onChange={on_formchange}
                    value={register_data.password}
                />

                <input
                    name="re_password"
                    type="password"
                    placeholder="confirm password"
                    required
                    disabled={register_data.password === ""}
                    onChange={on_formchange}
                    value={register_data.re_password}
                    ref={re_password_ref}
                />

                <div className="fixed_height_container">
                    {loading ?
                        <div>loading</div>
                        :
                        <button type="submit" className="submit_btn" >
                            Sign Up
                        </button>
                    }
                </div>

            </form>

            <p>already have an account ? &nbsp; <Link href="/auth/login" shallow>Sign In</Link></p>
        </div>
    )
}

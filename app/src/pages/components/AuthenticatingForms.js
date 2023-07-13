import React from 'react'
import { useState, useRef, useContext } from 'react'
import async_http_request from './AsyncRequest'
import { GlobalStates } from 'App'


const AuthenticatingForms = () => {

    const { set_fetched_user_data_and_authenticate } = useContext(GlobalStates)
    const [login_view, set_login_view] = useState(true)
    const [res_msg, set_res_msg] = useState()
    const [pass_strength_msg, set_pass_strength_msg] = useState()
    const [pass_is_strong, set_pass_is_strong] = useState(false)
    const [pass_match, set_pass_match] = useState(false)
    const [loading, set_loading] = useState()

    const [login_data, set_login_data] = useState({
        username: "",
        password: ""
    })

    const [register_data, set_register_data] = useState({
        username: "",
        email: "",
        password: "",
        confirmed_password: ""
    })

    const extra_space = /\s{2,}/
    const strong_pass_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/

    const password_ref = useRef(null)
    const confirmed_password_ref = useRef(null)


    const switch_view = () => {
        set_login_view(!login_view)
        set_res_msg()
    }

    const check_pass_strength = (pass_value) => {

        if (pass_value == "") {
            password_ref.current.style.outlineColor = ""
            set_pass_strength_msg()
            return
        }

        if (pass_value.length < 6) {
            set_pass_strength_msg("Password must be at least 6 characters")
            password_ref.current.style.outlineColor = "red"
            set_pass_is_strong(false)
            return
        }

        if (pass_value.match(strong_pass_pattern) === null) {
            set_pass_strength_msg("Password must contain at least one capital letter, small letter, and number")
            password_ref.current.style.outlineColor = "red"
            set_pass_is_strong(false)
            return
        }

        password_ref.current.style.outlineColor = ""
        set_pass_is_strong(true)
        set_pass_strength_msg()
    }

    const check_pass_match = () => {

        if (password_ref.current.value === "") {
            confirmed_password_ref.current.style.outlineColor = ""
            return
        }

        if (confirmed_password_ref.current.value === password_ref.current.value) {
            confirmed_password_ref.current.style.outlineColor = "green"
            set_pass_match(true)
            return
        }
        set_pass_match(false)
        confirmed_password_ref.current.style.outlineColor = "red"
    }


    const handle_login_form = (e) => {
        const { name, value } = e.target
        set_login_data(prev => ({ ...prev, [name]: value }))
    }


    const handle_register_form = (e) => {

        const { name, value } = e.target

        if (name === "username" && value.match(extra_space) != null) {
            return
        }

        set_register_data(prev => ({ ...prev, [name]: value }))
    }


    const register_user = async (submit_event) => {

        submit_event.preventDefault()

        if (!pass_is_strong || !pass_match) {
            return
        }

        set_loading(true)

        const register_res = await async_http_request({
            path: "register/",
            method: "POST",
            data: {
                "username": register_data.username,
                "email": register_data.email,
                "password": register_data.password
            }
        })

        set_loading(false)
        set_res_msg(register_res.payload.info)

        if (register_res.status === 201) {
            set_fetched_user_data_and_authenticate(register_res.payload)
        }
    }

    const login_user = async (submit_event) => {

        submit_event.preventDefault()

        set_loading(true)

        const login_res = await async_http_request({
            path: "login/",
            method: "POST",
            data: {
                "username": login_data.username,
                "password": login_data.password
            }
        })

        set_loading(false)
        set_res_msg(login_res.payload.info)

        if (login_res.status === 200) {
            set_fetched_user_data_and_authenticate(login_res.payload)
        }
    }

    // authenticate user (for the the first time it creates a new user) using his google account 
    const continue_with_google = () => {
        document.getElementById("google_authenticate_form").submit()
    }

    return (
        <div className="authenticating_forms">

            <div className="google_container">
                <button className="google_btn" onClick={continue_with_google}>
                    Continue with Google
                </button>
            </div>


            {login_view ?
                <div className="login_container">
                    <a href="/accounts/password/reset/" className="simple_link">Forgot password ?</a>

                    <form onSubmit={login_user} >
                        <input
                            name="username"
                            type="text"
                            required
                            placeholder="username"
                            onChange={handle_login_form}
                            value={login_data.username}
                        />


                        <input
                            name="password"
                            type="password"
                            required
                            placeholder="password"
                            onChange={handle_login_form}
                            value={login_data.password}
                        />
                        {res_msg && !loading && <div>{res_msg}<br /></div>}

                        <div className="fixed_height_container">
                            {!loading ? <button type="submit" className="submit_btn" >Login</button> : "loading"}
                        </div>

                    </form>
                </div>
                :
                <form onSubmit={register_user} >
                    <input
                        name="username"
                        type="text"
                        required
                        placeholder="username"
                        minLength={6}
                        onChange={handle_register_form}
                        value={register_data.username}
                    />

                    <input
                        name="email"
                        type="email"
                        required
                        placeholder="email"
                        onChange={handle_register_form}
                        value={register_data.email}
                    />

                    <input
                        name="password"
                        type="password"
                        required
                        placeholder="password"
                        onChange={e => { handle_register_form(e); check_pass_strength(e.target.value); check_pass_match() }}
                        value={register_data.password}
                        ref={password_ref}
                    />
                    {pass_strength_msg && <div className="pass_msg">{pass_strength_msg}<br /></div>}

                    <input
                        name="confirmed_password"
                        type="password"
                        required
                        placeholder="confirm password"
                        onChange={e => { handle_register_form(e); check_pass_match() }}
                        value={register_data.confirmed_password}
                        ref={confirmed_password_ref}
                    />
                    {res_msg && !loading && <div>{res_msg}<br /></div>}

                    <div className="fixed_height_container">
                        {!loading ? <button type="submit" className="submit_btn" >Sign Up</button> : "loading"}
                    </div>

                </form>
            }

            <p>
                {login_view ? "new here ?" : "already have account ?"} &nbsp;
                <button className="simple_link" onClick={switch_view}>
                    {login_view ? "Sign up" : "Log in"}
                </button>
            </p>
        </div>
    )
}

export default AuthenticatingForms
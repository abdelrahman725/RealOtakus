import React from 'react'
import { useState, useRef, useContext } from 'react'
import async_http_request from './AsyncRequest'
import { GlobalStates } from 'App'
import Select from 'react-select'
import { SelectStyles, countries } from "Constants"

const AuthenticatingForms = () => {

    const { fetch_authenticated_user_data } = useContext(GlobalStates)
    const [login_view, set_login_view] = useState(true)
    const [res_msg, set_res_msg] = useState()
    const [loading, set_loading] = useState()
    const [selected_country, set_selected_country] = useState()

    const [login_data, set_login_data] = useState({
        username: "",
        password: ""
    })

    const [register_data, set_register_data] = useState({
        username: "",
        email: "",
        country: "",
        password: "",
        confirmed_password: ""
    })

    const confirmed_password_ref = useRef(null)
    const country_select = useRef(null)

    const extra_space = /\s{2,}/

    const on_country_selection = (selected) => {
        set_selected_country(selected)
        set_register_data(prev => ({ ...prev, country: selected.value }))
    }

    const switch_view = () => {
        set_login_view(!login_view)
        set_res_msg()
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

    const validate_then_register = (submit_event) => {

        submit_event.preventDefault()

        if (register_data.password !== register_data.confirmed_password) {
            confirmed_password_ref.current.style.outlineColor = "red"
            confirmed_password_ref.current.focus()
            return
        }

        if (!register_data.country) {
            country_select.current.focus()
            return
        }

        register_user()
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
            fetch_authenticated_user_data()
        }
    }

    const register_user = async () => {

        set_loading(true)

        const register_res = await async_http_request({
            path: "register/",
            method: "POST",
            data: {
                "username": register_data.username,
                "email": register_data.email,
                "country": register_data.country,
                "password": register_data.password
            }
        })

        set_loading(false)
        set_res_msg(register_res.payload.info)

        if (register_res.status === 201) {
            fetch_authenticated_user_data()
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
                <form onSubmit={validate_then_register} >
                    <input
                        name="username"
                        type="text"
                        required
                        placeholder="username"
                        minLength={5}
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

                    <Select
                        styles={SelectStyles}
                        className="select_country"
                        name="country"
                        placeholder="country"
                        isClearable={false}
                        isLoading={!countries}
                        options={countries}
                        onChange={on_country_selection}
                        value={selected_country}
                        ref={country_select}
                    /><br />

                    <input
                        name="password"
                        type="password"
                        required
                        placeholder="password"
                        minLength={6}
                        onChange={handle_register_form}
                        value={register_data.password}
                    />

                    <input
                        name="confirmed_password"
                        type="password"
                        required
                        placeholder="confirm password"
                        onChange={handle_register_form}
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
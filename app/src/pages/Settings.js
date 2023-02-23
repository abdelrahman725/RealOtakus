import React from 'react'
import async_http_request from './components/AsyncRequest'
import { GlobalStates } from 'App'
import { useState } from 'react'
import { useContext } from 'react'

const Settings = () => {

    const { set_authenticated } = useContext(GlobalStates)
    const [pre_delete, set_pre_delete] = useState(false)
    const [password, set_password] = useState("")
    const [res_msg, set_res_msg] = useState("")

    const delete_account = async (submit_event) => {

        submit_event.preventDefault()

        const delete_user_res = await async_http_request({
            path: "delete_account/",
            method: "DELETE",
            data: {
                password: password
            }
        })

        console.log(delete_user_res)

        if (delete_user_res === null) {
            set_res_msg("Error occurred")
            return
        }

        if (delete_user_res.status === 403) {
            set_res_msg("wrong password")
            return
        }

        set_authenticated(false)

    }

    return (
        <div className="settings centered_div">
            <h2>Danger Zone</h2>
            <div className="danger_container">
                <p>Delete your account and all data connected to it</p>
                <button className="darker_on_hover pre_delete" onClick={() => set_pre_delete(!pre_delete)}>
                    delete account
                </button>

                {pre_delete &&
                    <form onSubmit={delete_account} >
                        <input
                            type="password"
                            name="password"
                            placeholder="enter your password"
                            autoFocus={true}
                            onChange={(e) => set_password(e.target.value)}
                            value={password}
                        />
                        <button type="submit" className="darker_on_hover delete">Delete!</button>
                    </form>
                }

                {res_msg && <p>{res_msg}</p>}

            </div >
        </div >
    )
}

export default Settings
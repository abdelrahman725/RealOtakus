import React from 'react'
import async_http_request from './components/AsyncRequest'
import { GlobalStates } from 'App'
import { useState } from 'react'
import { useContext } from 'react'

const Settings = () => {

    const { set_authenticated } = useContext(GlobalStates)
    const [pre_delete, set_pre_delete] = useState(false)
    const [user_input, set_user_input] = useState("")
    const [res_msg, set_res_msg] = useState("")
    const CONFIRMATION_TEXT = "I understand and wish to proceed"

    const delete_account = async (submit_event) => {

        submit_event.preventDefault()

        if (CONFIRMATION_TEXT !== user_input) {
            return
        }

        set_res_msg("loading..")

        const delete_user_res = await async_http_request({
            path: "delete_account/",
            method: "DELETE"
        })

        console.log(delete_user_res)

        if (delete_user_res === null) {
            set_res_msg("Error occurred")
            return
        }

        set_authenticated(false)
    }

    return (
        <div className="settings centered_div">
            <h2>Danger Zone</h2>
            <div className="danger_container">
                <p className="title">Delete your account and all data connected to it</p>
                <button className="darker_on_hover pre_delete" onClick={() => set_pre_delete(!pre_delete)}>
                    delete account
                </button>

                {pre_delete &&
                    <form onSubmit={delete_account}>
                        <p>
                            Please type <strong>"{CONFIRMATION_TEXT}"</strong> to confirm.
                        </p>

                        <input
                            type="text"
                            autoComplete="off"
                            maxLength={CONFIRMATION_TEXT.length}
                            autoFocus={true}
                            onChange={(e) => set_user_input(e.target.value)}
                            value={user_input}
                        />

                        <button
                            className={`darker_on_hover ${user_input !== CONFIRMATION_TEXT ? "disabled_btn" : ""}`}
                            type="submit"
                        >
                            Delete
                        </button>
                    </form>
                }

                {res_msg && <p>{res_msg}</p>}

            </div >
        </div >
    )
}

export default Settings
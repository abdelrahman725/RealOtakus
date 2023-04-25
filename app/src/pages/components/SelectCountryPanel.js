import React from 'react'
import Select from 'react-select'
import { CgCloseO } from 'react-icons/cg'
import { useState, useContext, useRef } from "react"
import { GlobalStates } from "App"
import { SelectStyles, COUNTRIES } from "Constants"
import async_http_request from './AsyncRequest'

const CountryPanel = ({ set_country_required }) => {

    const { set_user_data } = useContext(GlobalStates)
    const [selected_country, set_selected_country] = useState()
    const [result_msg, set_result_msg] = useState()
    const [loading, set_loading] = useState()
    const country_select = useRef(null)

    const on_country_selection = (selected) => {
        set_selected_country(selected)
    }

    const handle_form_submission = (e) => {

        e.preventDefault()

        async function submit_selected_country() {

            set_loading(true)

            const saving_country_response = await async_http_request({
                path: "post_country",
                method: "POST",
                data: { "country": selected_country.value }
            })

            set_loading(false)

            if (saving_country_response === null) {
                set_result_msg("error saving country, please try again")
                return
            }

            // after country gets saved successfully, we close current panel and set the user country with the value selected 
            set_user_data(prev => ({
                ...prev,
                country: selected_country.value
            }))

            set_country_required(false)
            set_result_msg("country saved")
        }

        if (!selected_country) {
            country_select.current.focus()
            return
        }

        submit_selected_country()
    }

    return (

        <div className="country_selection_panel">

            <CgCloseO className="icon close_icon" onClick={() => set_country_required(false)} />

            <h1>Welcome to Real Otakus !</h1>

            <form onSubmit={handle_form_submission}>
                <Select
                    styles={SelectStyles}
                    className="react_select"
                    placeholder="choose your country"
                    isClearable={false}
                    isLoading={!COUNTRIES}
                    options={COUNTRIES}
                    onChange={on_country_selection}
                    value={selected_country}
                    ref={country_select}
                />

                <div className="lower_div">
                    {!loading ?
                        <button type="submit" className="submit_btn"> submit</button>
                        :
                        <div className="info_message">
                            loading
                        </div>
                    }
                </div>

                <div className="info_message">
                    {result_msg}
                </div>

            </form>

        </div>
    )
}

export default CountryPanel
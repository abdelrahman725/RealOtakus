import getCookie from "./getCookie"
import { DJANGO_APP_URL } from "Constants"

const async_http_request = async ({ server = DJANGO_APP_URL, path = null, method = "GET", data = null } = {}) => {

    const url = path ? `${server}/${path}` : server

    if (method !== "GET") {

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(data)
            })

            const status_code = response.status
            const result_data = await response.json()

            return {
                payload: result_data,
                status: status_code
            }
        }

        catch (error) {
            console.log("catching error! ", error)
            return null
        }
    }

    else {
        try {
            const response = await fetch(url, {
                'Accept': 'application/json'
            })
            const status_code = response.status
            const result_data = await response.json()

            return {
                payload: result_data,
                status: status_code
            }

        }

        catch (error) {
            console.log("catching error! ", error)
            return null
        }
    }

}

export default async_http_request

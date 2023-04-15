import getCookie from "./getCookie"
import { DJANGO_APP_URL } from "Constants"


const async_http_request = async ({ server = DJANGO_APP_URL, path = null, method = "GET", data = null, set_too_many_requests = null } = {}) => {

    const url = path ? `${server}/${path}` : server

    try {

        let response = null

        if (method !== "GET") {

            response = await fetch(url, {
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(data)
            })
        }

        else {
            response = await fetch(url)
        }

        const status_code = response.status
        const result_data = await response.json()

        console.log(result_data)

        if (set_too_many_requests && status_code === 429) {
            set_too_many_requests(true)
        }

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

export default async_http_request

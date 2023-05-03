import getCookie from "./getCookie"
import { DJANGO_URL } from "Constants"

const async_http_request = async ({ server = DJANGO_URL, path = null, method = "GET", data = null } = {}) => {

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

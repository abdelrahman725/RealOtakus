import { BACKEND_API } from "./constants"
import { RefreshToken } from "./authrequests"
import { toast } from "react-toastify";
import ConsoleLog from '@/components/utils/custom_console';

async function make_request({ path = null, method = "GET", req_data = {} } = {}) {

    let response = null

    if (method !== "GET") {

        response = await fetch(`${BACKEND_API}/${path}`, {
            method: method,
            credentials: "include",
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(req_data)
        })
    }

    else {
        response = await fetch(`${BACKEND_API}/${path}`, {
            credentials: "include",
            headers: {
                'Content-type': 'application/json',
            },
        })
    }

    const status_code = response.status

    // if (status_code === 500) {
    //     toast.error("server error")
    // }

    if (status_code === 200) {
        const result_data = await response.json()
        return {
            payload: result_data,
            status_code: status_code
        }
    }

    return {
        status_code: status_code
    }

}

export default async function ReAuthorizedApiRequest({ path = null, method = "GET", req_data = {} } = {}) {
    try {
        const original_request = await make_request({ path: path, method: method, req_data: req_data })

        if (original_request.status_code === 401) {
            ConsoleLog("refreshing original request")

            const refresh_res = await RefreshToken()

            if (refresh_res.status_code !== 200) {
                toast.info("Session expired")
                return refresh_res
            }

            // re-request the original request after access token has been refreshed
            const refreshed_reuest = await make_request({ path: path, method: method, req_data: req_data })
            ConsoleLog(`reauthorized request : /${path}`)

            return refreshed_reuest
        }

        ConsoleLog(`original request : /${path}`)
        return original_request
    }

    catch (error) {
        toast.error("network error")
        ConsoleLog(error)
        return null
    }
}

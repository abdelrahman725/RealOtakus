import { BACKEND_API } from "./constants"
import { RefreshToken } from "./authrequests"
import { toast } from "react-toastify";
import ConsoleLog from '@/components/utils/custom_console';

export default async function ReAuthorizedApiRequest({ path = "", method = "GET", request_data = null } = {}) {

    try {
        const request_options = {
            method: method,
            credentials: "include",
            headers: {
                'Content-type': 'application/json'
            },
        }

        if (request_data !== null) {
            request_options.body = JSON.stringify(request_data)
        }

        let response = null

        response = await fetch(`${BACKEND_API}/${path}`, request_options)

        if (response.status === 500) {
            toast.error("server error")
            return null
        }

        if (response.status === 401) {
            ConsoleLog("refresh token request")

            const refresh_token_response = await RefreshToken()

            if (refresh_token_response.status_code !== 200) {
                toast.info("Session expired")
                return refresh_token_response
            }

            // re-request the original request after access token has been refreshed
            response = await fetch(`${BACKEND_API}/${path}`, request_options)
        }

        const response_json = await response.json()
        ConsoleLog(`result for /${path} : `)
        ConsoleLog(response_json)
        return {
            payload: response_json,
            status_code: response.status
        }
    }

    catch (error) {
        toast.error("unexpected error occurred")
        ConsoleLog(error)
        return null
    }
}

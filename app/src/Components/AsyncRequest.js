
import getCookie from '../GetCookie'
export const domain = "127.0.0.1:8000"

const CsrfToken = getCookie('csrftoken')

const myserver = `http://${domain}`


const async_http_request = async ({ server = myserver, path = null, method = "GET", data = null } = {}) => {
    
    const url = path ? `${server}/${path}` : server

    if (method !== "GET") {

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-type': 'application/json',
                    'X-CSRFToken': CsrfToken,
                },
                body: JSON.stringify(data)
            })

            if (!response.ok){
                return response
            }
            
            const result = await response.json()
            return result
        }

        catch (error) {
            console.log("catching error! ", error)
            return null
        }
    }

    else {
        try {
            const response = await fetch(url)
            const result = await response.json()
            return result
        }

        catch (error) {
            console.log("catching error! ", error)
            return null
        }
    }


}

export default async_http_request

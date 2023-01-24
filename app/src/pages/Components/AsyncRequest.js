
export const our_domain = "127.0.0.1:8000"

const django_app_url = `http://${our_domain}`

const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const CsrfToken = getCookie('csrftoken')

const async_http_request = async ({ server = django_app_url, path = null, method = "GET", data = null } = {}) => {

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
            const response = await fetch(url)
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

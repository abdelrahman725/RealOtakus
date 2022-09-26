import getCookie from '../GetCookie'

const CsrfToken = getCookie('csrftoken')
const  myserver  = `http://127.0.0.1:8000/home`

const async_http_request = async({ server = myserver, path=null, method="GET", data=null }={})=>{
        
    const url = path?`${server}/${path}`: server

    if (method !== "GET"){
        const send_request = await fetch(url,{
            method : method,
            headers : {
                'Content-type': 'application/json',
                'X-CSRFToken': CsrfToken,
            },
            body : JSON.stringify(data)
        })
        const res  = await send_request.json()
        return res
    }

    else {
        const send_request  = await fetch(url)
        const res  = await send_request.json()
        return res
    }

   
}

export default async_http_request

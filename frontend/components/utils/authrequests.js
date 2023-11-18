import { AUTH_API } from "@/components/utils/constants";
import { toast } from 'react-toastify';
import ConsoleLog from "./custom_console";

export async function ContinueWithGoogle() {
    try {
        const url = `${AUTH_API}/o/google-oauth2/?redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URL}/auth/google`;

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
            credentials: 'include',
        })

        const data = await res.json();

        if (res.status === 200) {
            return { data }
        }

        else {
            toast.error("Error authenticating with social provider");
            return null
        }
    }
    catch (err) {
        ConsoleLog(err)
        toast.error('network error');
        return null
    }
}

export async function GoogleAuthenticate(state, code) {
    const res = await fetch(`${AUTH_API}/o/google-oauth2/?state=${encodeURIComponent(state)}&code=${encodeURIComponent(code)}`, {
        method: "POST",
        credentials: "include",
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        }
    })
    const status_code = res.status
    return { status_code }
}

export async function Register(email, username, password) {

    const res = await fetch(`${AUTH_API}/users/`, {
        method: "POST",
        credentials: "include",
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            "email": email,
            "username": username,
            "password": password
        })
    })
    const status_code = res.status
    const res_data = await res.json()
    return { res_data, status_code }
}

export async function ActivateAccount(uid, token) {

    const res = await fetch(`${AUTH_API}/users/activation/`, {
        method: "POST",
        credentials: "include",
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ "uid": uid, "token": token })
    })
    const status_code = res.status
    return { status_code }
}

export async function ResendActivationEmail(email) {

    const res = await fetch(`${AUTH_API}/users/resend_activation/`, {
        method: "POST",
        credentials: "include",
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ "email": email })
    })
    const status_code = res.status
    return { status_code }
}

export async function Login(email, password) {

    const res = await fetch(`${AUTH_API}/jwt/create/`, {
        method: "POST",
        credentials: "include",
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ "email": email, "password": password })
    })

    const status_code = res.status
    const res_data = await res.json()
    return { res_data, status_code }
}

export async function VerifyToken() {
    try {
        const res = await fetch(`${AUTH_API}/jwt/verify/`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-type': 'application/json',
            }
        })

        const status_code = res.status
        return { status_code }
    }

    catch (err) {
        ConsoleLog(err)
        return null
    }
}

export async function RefreshToken() {

    try {
        const res = await fetch(`${AUTH_API}/jwt/refresh/`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-type': 'application/json',
            }
        })
        const status_code = res.status
        return { status_code }

    }

    catch (err) {
        ConsoleLog(err)
        return null
    }
}

export async function EmailForPasswordReset(email) {

    const res = await fetch(`${AUTH_API}/users/reset_password/`, {
        method: "POST",
        credentials: "include",
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ "email": email })
    })

    const status_code = res.status
    return { res, status_code }
}

export async function ConfirmPasswordReset(uid, token, new_password) {

    const res = await fetch(`${AUTH_API}/users/reset_password_confirm/`, {
        method: "POST",
        credentials: "include",
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            "uid": uid,
            "token": token,
            "new_password": new_password
        })
    })

    const status_code = res.status
    return { res, status_code }
}
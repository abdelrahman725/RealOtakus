"use client"

import { ContinueWithGoogle } from './utils/authrequests'
import { useRouter } from 'next/navigation'

export default function GoogleButton() {

    const router = useRouter()

    const SocialAuthenticate = async (e) => {
        const res = await ContinueWithGoogle()
        res !== null ? router.replace(res.data.authorization_url) : e.target.disabled = false
    }

    return (
        <button className="google_btn" onClick={(e) => { e.target.disabled = true; SocialAuthenticate(e) }}>
            continue with google
        </button>
    )
}
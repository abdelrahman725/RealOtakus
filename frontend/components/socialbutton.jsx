"use client"

import { ContinueWithGoogle } from './utils/authrequests'

export default function GoogleButton() {
    return (
        <button className="google_btn" onClick={(e) => { e.target.disabled = true; ContinueWithGoogle() }}>
            continue with google
        </button>
    )
}
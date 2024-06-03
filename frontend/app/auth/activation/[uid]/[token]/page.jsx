"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { ActivateAccount } from '@/components/utils/authrequests';
import ConsoleLog from '@/components/utils/custom_console';

export default function Page({ params }) {

    const router = useRouter();
    const { uid, token } = params;

    useEffect(() => {

        async function activate_account() {

            try {
                const response = await ActivateAccount(uid, token)

                ConsoleLog(response)

                // new user is successfully activated
                if (response.status_code === 204) {
                    toast.success('Account is activated, you can now login');
                    router.replace('/auth/login');
                }

                // user account is already active 
                if (response.status_code === 403) {
                    toast.warning('Account is already active');
                    router.replace('/auth/login');
                }

                if (response.status_code === 400) {
                    toast.error('Invalid request, Failed to activate account');
                    router.replace('/auth/register');
                }
            }

            catch (error) {
                toast.error("network error")
                ConsoleLog(error)
            }
        }

        activate_account()
    }, [])

    return (
        <div className="centered">
            <p>Activating your account...</p>
        </div>
    );
}
'use client';

import { redirect } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';

export default function RequireAonymous({ children }) {
    const { IsAuthenticated } = useAuthContext()

    if (IsAuthenticated) {
        redirect('/');
    }

    return <>{children}</>;
}
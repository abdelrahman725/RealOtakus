'use client';

import { redirect } from 'next/navigation';
import { useAuthContext } from '@/contexts/GlobalContext';

export default function RequireAuthentication({ children }) {
    const { IsAuthenticated } = useAuthContext()

    if (IsAuthenticated === true) {
        return <>{children}</>;
    }

    redirect('/');
}
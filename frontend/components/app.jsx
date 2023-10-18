"use client"

import MyToastContainer from '@/components/toast'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { usePathname } from 'next/navigation';
import { GlobalProvider } from '@/contexts/GlobalContext';

export default function App({ children }) {
    const pathname = usePathname();

    if (pathname === "/terms" || pathname === "/privacy") {
        return <>{children}</>;
    }

    return (
        <GlobalProvider>
            <Navbar />
            <MyToastContainer />
            <main>{children}</main>
            <Footer />
        </GlobalProvider>
    )
}
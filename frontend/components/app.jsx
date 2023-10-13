"use client"

import MyToastContainer from '@/components/toast'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ParentProvider from '@/app/ParentWrapper';
import { usePathname } from 'next/navigation';

export default function App({ children }) {
    const pathname = usePathname();

    if (pathname === "/terms" || pathname === "/privacy") {
        return <>{children}</>;
    }

    return (
        <ParentProvider>
            <Navbar />
            <MyToastContainer />
            <main>{children}</main>
            <Footer />
        </ParentProvider>
    )
}
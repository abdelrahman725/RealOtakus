"use client"

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { toast } from "react-toastify"

export default function MyToastContainer() {

    useEffect(() => {
        document.addEventListener("keydown", e => e.key === "Escape" && toast.dismiss())
    }, [])

    return <ToastContainer className="toast" hideProgressBar newestOnTop draggablePercent={30} autoClose={4000} />;
}
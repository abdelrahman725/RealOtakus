import { AuthProvider } from "@/contexts/AuthContext";
import { GlobalProvider } from "@/contexts/GlobalContext";

export default function ParentProvider({ children }) {

    return (
        <AuthProvider>
            <GlobalProvider>
                {children}
            </GlobalProvider>
        </AuthProvider>
    )
}

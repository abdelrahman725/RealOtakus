import { Navigate } from "react-router-dom"
import { GlobalStates } from "App"
import { useContext } from "react"

const AuthenticatedRoute = ({ children }) => {

    const { authenticated } = useContext(GlobalStates)

    if (authenticated === true) {
        return children
    }
    return <Navigate to="/" replace />

}
export default AuthenticatedRoute
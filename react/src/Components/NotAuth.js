import { useState } from 'react'
import Register from './Register'
import Login from './Login'
import Countries from '../countries.json'

const LoginRegisterView = ({csrftoken,IP,authenticate,isauthenticated})=>
{

 const [LoginView,setLoginView] = useState()
 const [RegisterView,setRegisterView] = useState()

 const RegisterPathUrl = `http://${IP}:8000/register`
 const LoginPathUrl    = `http://${IP}:8000/login`

return(
  
  <div className="LoginRegisterView">

    {/* Login */}
      <Login login_path={LoginPathUrl} authenticate={authenticate} csrftoken={csrftoken}/>

    {/* Registration */}
      <Register register_path={RegisterPathUrl} authenticate={authenticate} csrftoken={csrftoken}/>
 

  </div>
  )

}

export default LoginRegisterView
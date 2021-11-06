import { useState } from 'react'
import Register from './Register'
import Login from './Login'


const LoginRegisterView = ({csrftoken,IP,authenticate,isauthenticated})=>
{

 const [LoginView,setLoginView] = useState(true)
 const [RegisterView,setRegisterView] = useState(false)
 const RegisterPathUrl = `http://${IP}:8000/register`
 const LoginPathUrl    = `http://${IP}:8000/login`

 const Switch=()=>{
   if(LoginView)
   {
     setLoginView(false)
     setRegisterView(true)
   }
   else
   {
    setLoginView(true)
    setRegisterView(false)
   }

 }

return(
  
  <div className="LoginRegisterView">


    {LoginView&&<Login login_path={LoginPathUrl} authenticate={authenticate} csrftoken={csrftoken} switchview={Switch}/>}
    {RegisterView&& <Register register_path={RegisterPathUrl} authenticate={authenticate} csrftoken={csrftoken} switchview={Switch}/>}
 

  </div>
  )

}

export default LoginRegisterView
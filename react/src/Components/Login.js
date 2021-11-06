import {useState} from 'react'
import {Button,FormControl,TextField} from '@material-ui/core'
const Login = ({login_path,authenticate,csrftoken,switchview})=>
{

  const [LoginData,setLoginData] = useState({
    name:"",
    pass:""
  })


  const HandleLoginForm = (e)=>{
    const newdata = {...LoginData}
    newdata[e.target.id] = e.target.value
    setLoginData(newdata)
 
  }

 
  const HandleLogin = async (e) =>{
     
     e.preventDefault();
     const res = await fetch(login_path,{
     method : 'POST',
     headers : {
       'Content-type': 'application/json',
       'X-CSRFToken': csrftoken
     },
     body: JSON.stringify({
       logindata:LoginData
     })
   })
   const response = await res.json()
   console.log(response.msg)

   if(response.msg==="success" && res.status===200)
   {
     authenticate();
   }

  

 }

 
  return(
    <div className="LoginView">

         
       <form onSubmit={(e)=>HandleLogin(e)} className="LoginForm">
  

        <TextField onChange={(e) => HandleLoginForm(e)} className="TextField" id="name" label="username" variant="filled" size="small"   value={LoginData.name} autoComplete="off" autoFocus />
        <TextField onChange={(e) => HandleLoginForm(e)} className="TextField" id="pass" label="password" variant="filled" size="small" 
        value={LoginData.pass}
        type="password" required/>

            <Button className="RegisterLoginBtn"
          variant="outlined" color="primary" size="small" type="submit">
            Sign in !
          </Button> 
          <a onClick={switchview}>don't have account ?</a>
        </form>
            

        
    </div>
  )
}
export default Login

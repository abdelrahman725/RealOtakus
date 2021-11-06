import {useState} from 'react'
import {Button,FormControl,TextField} from '@material-ui/core'
const Login = ({login_path,authenticate,csrftoken})=>
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

         {/* 
       <form onSubmit={(e)=>HandleLogin(e)} className="LoginForm">
          <input onChange={(e) => HandleLoginForm(e)} type="text" id="name"  placeholder="username" value={LoginData.name}
          required autoFocus autoComplete="off"/>

          <input onChange={(e) => HandleLoginForm(e)} type="password" id="pass" placeholder="password" value={LoginData.pass} required/>
          
          <button type="submit">Sign in</button> 

        <TextField className="TextField" id="outlined-basic" label="username" variant="filled" size="small" autoComplete="off" autoFocus />
        <TextField className="TextField" type="password" id="outlined-basic" label="password" variant="filled" size="small" />

            <Button className="RegisterLoginBtn"
          variant="outlined" color="primary" size="small">
            Sign 
          </Button> 
      
        </form>
             */}

        
    </div>
  )
}
export default Login

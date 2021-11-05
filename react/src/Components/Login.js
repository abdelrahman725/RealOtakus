import {useState} from 'react'

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

       <form onSubmit={(e)=>HandleLogin(e)}>
          <input onChange={(e) => HandleLoginForm(e)} type="text" id="name"  placeholder="username" value={LoginData.name}
          required autoFocus autoComplete="off"/>

          <input onChange={(e) => HandleLoginForm(e)} type="password" id="pass" placeholder="password" value={LoginData.pass} required/>
          
          <button type="submit">Sign in</button>
        </form>

      

        
    </div>
  )
}
export default Login

import {useState} from 'react'
const Register = ({register_path,authenticate,csrftoken})=>
{
  const [RegisterData,setRegisterData] = useState({
    registername:"",
    pass1:"",
    pass2:"",
    country:""
  })

  const HandleRegisterForm = (e)=>{
    const newdata = {...RegisterData}
    newdata[e.target.id] = e.target.value
    setRegisterData(newdata)
 
  }


  const HandleRegister = async (e) =>{
    e.preventDefault();
 
    const res = await fetch(register_path,{
    method : 'POST',
    headers : {
      'Content-type': 'application/json',
      'X-CSRFToken': csrftoken
    },
    body: JSON.stringify({
      registerdata:RegisterData
    })
  })
  const response= await res.json()
  console.log(response.msg)
  
  if (response.msg==="registered" && res.status===201)
  {
    authenticate()
  }
 
 }

  return(

    <div className="RegisterView">
      <form onSubmit={(e)=>HandleRegister(e)}>
          <input onChange={(e) =>  HandleRegisterForm(e)} type="text" id="registername"  placeholder="username" value={RegisterData.registername}
          required autoComplete="off"/>
          <input onChange={(e) =>  HandleRegisterForm(e)} type="password" id="pass1"  placeholder="password" value={RegisterData.pass1} required/>
          <input onChange={(e) =>  HandleRegisterForm(e)} type="password" id="pass2"  placeholder="confirm password" value={RegisterData.pass2} required/>

          <input onChange={(e) =>  HandleRegisterForm(e)} type="text" id="country"  placeholder="country" value={RegisterData.country} required autoComplete="off"/>
          <button type="submit">Sign up</button>
        </form>
      

        
    </div>
  )
}
export default Register

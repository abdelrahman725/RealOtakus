import {useState} from 'react'
import {Button,FormControl,TextField} from '@material-ui/core'

import Countries from '../countries.json'


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

 const countries =[]
 for (const code in Countries){
   countries.push({code:code,countrname:Countries[code]})
 }

  return(

    <div className="RegisterView">
           <form onSubmit={(e)=>HandleRegister(e)} className="RegisterForm">
            {/* <input onChange={(e) =>  HandleRegisterForm(e)} type="text" id="registername"  placeholder="username" value={RegisterData.registername}
            required autoComplete="off"/>
            <input onChange={(e) =>  HandleRegisterForm(e)} type="password" id="pass1"  placeholder="password" value={RegisterData.pass1} required/>
            <input onChange={(e) =>  HandleRegisterForm(e)} type="password" id="pass2"  placeholder="confirm password" value={RegisterData.pass2} required/> */}


            <TextField className="TextField" id="outlined-basic" label="username" variant="filled" size="small" autoComplete="off" autoFocus />
            <TextField className="TextField" type="password" id="outlined-basic" label="password" variant="filled" size="small" />
            <TextField className="TextField" type="password" id="outlined-basic" label="confirm" variant="filled" size="small" />


            <select>
            {countries.map((country)=>(
              <option value={country.code}>
              {country.countrname}
              </option>
            ))}
        </select>

        <Button className="RegisterLoginBtn"
          variant="outlined" color="primary" size="small">
            Sign up
          </Button>

        </form>

       



    </div>
  )
}
export default Register





import {useState} from 'react'
import {Button,FormControl,TextField,Select,InputLabel,MenuItem} from '@material-ui/core'

import Countries from '../countries.json'


const Register = ({register_path,authenticate,csrftoken,switchview})=>
{
  const [RegisterData,setRegisterData] = useState({
    registername:"",
    pass1:"",
    pass2:"",
    country:"",
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


            <TextField onChange={(e) =>  HandleRegisterForm(e)} className="TextField" id="registername" label="username" variant="filled" size="small" autoComplete="off" autoFocus  value={RegisterData.registername} required/>
            <TextField onChange={(e) =>  HandleRegisterForm(e)} className="TextField" id="pass1" type="password"  label="password" variant="filled" size="small" required/>
            <TextField onChange={(e) =>  HandleRegisterForm(e)} className="TextField" id="pass2" type="password"  label="confirm" variant="filled" size="small" required/>

      
               
         
            <div className="select-box">
          <label htmlFor="select-box1" className="label select-box1">
            <div className="label-desc">
            {RegisterData.country===""?
            "Choose your country":
            <span>

            <img  src={`https://flagcdn.com/120x90/${RegisterData.country}.png`}width="20" alt="flag"/>
             {" "}{Countries[RegisterData.country]}
            </span>
            }
            </div> 
          </label>
     
          <select  className="select" id="country"
           onChange={(e) =>  HandleRegisterForm(e)} >
            {countries.map((country,index)=>(
                <option value={country.code} key={index}>
                  {country.countrname}
                </option>
             ))}
          </select>
        </div> 



        <Button className="RegisterLoginBtn"
          variant="outlined" color="primary" size="small" type="submit">
            Sign up !
          </Button>
        <a onClick={switchview}>already have an account ?</a>
        </form>


       



    </div>
  )
}
export default Register





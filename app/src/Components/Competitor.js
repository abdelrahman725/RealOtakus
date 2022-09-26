import { useEffect,useState } from "react"

const Competitor = ({name,points,level,country,contributions,user_equal_logged_user}) => {
  
  const [flag,setflag] = useState()

  const fetch_flag_url = async() =>{
    const flag_res = await fetch(`https://flagcdn.com/256x192/${country}.png`) 
    setTimeout(()=>{setflag(flag_res.url)} ,500)
  }  

  useEffect(()=>{
   country && fetch_flag_url()
  },[])
  return (

  <tr className="eachcompetitor">
    <td>{name}</td>
    <td>{points}</td>
    <td>{level}</td>
    <td>{contributions}</td>
    <td>        
    {country? flag?<img src={flag} width="32"height="24"></img> : "loading" :"N/A" }
    </td>
  </tr>

  )
}

export default Competitor
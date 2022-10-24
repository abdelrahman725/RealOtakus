import { FaCrown } from 'react-icons/fa'
import { useEffect,useState } from "react"

const Competitor = ({name,points, level, country, contributions, is_logged_in_user, index}) => {
  
  const [flag,setflag] = useState()

  useEffect(()=>{

    async function fetch_flag_url(){
      const flag_res = await fetch(`https://flagcdn.com/256x192/${country}.png`)       
      setTimeout(()=>{ setflag(flag_res.url)} ,600)
    }

    country && fetch_flag_url()
  },[])
  
  return (

  <tr className="competitor">
    <td className={index===0 ?"top_competitor":""}>
     {index === 0 &&<FaCrown className="top_competitor_icon"/>}
      {name}
    </td>
    <td>{points}</td>
    <td>{level}</td>
    <td>{contributions}</td>
    <td>        
    {country? flag?<img src={flag} width="32"height="24"></img> : "loading" : "N/A" }
    </td>
  </tr>

  )
}

export default Competitor
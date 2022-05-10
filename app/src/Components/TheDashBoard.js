import Competitor from "./Competitor"
import { useEffect,useState,useContext } from "react"
import { ServerContext } from "../App"
const TheDashBoard = () => {

  const {server} = useContext(ServerContext)
  const dashboardurl = `${server}/home/dashboard`

  const[otakus,setotakus] = useState()

  const GetDashbBoard = async()=>
  {
    const res = await fetch(dashboardurl)
    const otakus= await res.json()
    setTimeout(()=>{

      setotakus(otakus)
    },1000)

  }


  useEffect(()=>{
    GetDashbBoard()
  },[])
return (
  <div className="dashboardview">
  {otakus?

<table className="dashboard">
  <thead>

  <tr>
    <th>name</th>
    <th>points</th>
    <th>level</th>
    <th>contributions</th>
    <th>country</th>

  </tr>
  </thead>
<tbody>
  
    {otakus.map((competitor,index)=> (
      
      <Competitor
      key={index}
      name={competitor.username}
      points={competitor.points}
      level={competitor.level}
      contributions={competitor.contributions_count}
      country = {competitor.country}/>
      ))}

  </tbody>
  </table>
      
  
          
  :"loading dashboard"}
  </div> 
  )
}

export default TheDashBoard
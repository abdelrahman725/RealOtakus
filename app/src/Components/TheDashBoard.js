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
  <div className="container">
  
  <h1>Top Ranked Otakus</h1>

<table className="dashboard">
  <thead>
  <tr>
    <th className="head">name</th>
    <th className="head">points</th>
    <th className="head">level</th>
    <th className="head">contributions</th>
    <th className="head">country</th>
  </tr>
  </thead>
<tbody>  
    {otakus?otakus.map((competitor,index)=> (    
      <Competitor
      key={index}
      name={competitor.username}
      points={competitor.points}
      level={competitor.level}
      contributions={competitor.contributions_count}
      country = {competitor.country}/>
      )):
      <Competitor
      name={" laoding "}
      points={"___________"}
      level={"___________"}
      contributions={"___________"}
      country = {"eg"}/>

      }

  </tbody>
  </table>
      
  
        
  </div> 
  )
}

export default TheDashBoard
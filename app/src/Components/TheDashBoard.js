import Competitor from "./Competitor"
import { useEffect,useState,useContext } from "react"
import { ServerContext } from "../App"

const TheDashBoard = ({logged_in_user}) => {

  const {server} = useContext(ServerContext)
  const dashboardurl = `${server}/home/dashboard`

  const[otakus,setotakus] = useState()
  const[information_about_animes,setinformation_about_animes] = useState()


  const GetDashbBoard = async()=>
  {
    const res = await fetch(dashboardurl)
    const dashboard = await res.json()
    setotakus(dashboard.leaderboard)
    setinformation_about_animes(dashboard.animes)
    
    //setTimeout(()=>{
    //},1000)
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
    <th className="head">score</th>
    <th className="head">level</th>
    <th className="head">contributions</th>
    <th className="head">country</th>
  </tr>
  </thead>
<tbody>  
    {otakus?otakus.map((competitor,index)=> (    
      <Competitor
      user_equal_logged_user={logged_in_user===competitor.id?true:false}
      key={index}
      name={competitor.username}
      points={competitor.points}
      level={competitor.level}
      contributions={competitor.n_contributions}
      country = {competitor.country}/>
      )):
      <Competitor
      name={" loading "}
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
import Competitor from "./Competitor"
import async_http_request from "./AsyncRequest"
import { useEffect,useState } from "react"

const TheDashBoard = ({logged_in_user}) => {

  const[otakus,setotakus] = useState()

  const GetDashbBoard = async()=>
  {
    const dashboard = await async_http_request({
      path:"dashboard"
    })

    setotakus(dashboard.leaderboard)
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
      name={"loading"}
      points={"___________"}
      level={"___________"}
      contributions={"___________"}
      country = {null}/>
    }

  </tbody>
  </table>
      
  
        
  </div> 
  )
}

export default TheDashBoard
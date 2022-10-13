import Competitor from "./Competitor"
import async_http_request from "./AsyncRequest"
import { GlobalStates } from "../App"
import { useEffect,useState,useContext } from "react"

const TheDashBoard = ({current_user}) => {

  const {set_info_message} = useContext(GlobalStates)
  const[dashboard_users,set_dashboard_users] = useState()

  useEffect(()=>{
    async function GetDashbBoard(){
      const dashboard_result = await async_http_request({
        path:"dashboard"
      })
  
      if (dashboard_result===null){
        set_info_message("network error")
        return
      }
  
      set_dashboard_users(dashboard_result.leaderboard)
      console.log("dashboard fetched")
    }

    GetDashbBoard() 
  
  },[])

return (
  <div className="dashboard_container">
  
    <h1 style={{textAlign:"center"}}>Top Competitors</h1>
  
    <table className="dashboard leaderboard">
    
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

        {dashboard_users?dashboard_users.map((competitor,index)=> (
          
          <Competitor
            is_logged_in_user={current_user===competitor.id}
            key={index}
            name={competitor.username}
            points={competitor.points}
            level={competitor.level}
            contributions={competitor.n_contributions}
            country = {competitor.country}/>
            )):
          
          <Competitor
            name={"________"}
            points={"________"}
            level={"________"}
            contributions={"________"}
            country = {null}/>
        }

      </tbody>
    
    </table>
            
  </div> 
  )
}

export default TheDashBoard
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
    setotakus(otakus)

  }


  useEffect(()=>{
    GetDashbBoard()
  },[])
return (
  <div className="dashboard">
  {otakus?
      <table>
      <thead>
        <tr>
          <th>username </th>
          <th>points</th>
          <th>level</th>
          <th>contributions &nbsp;</th>
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
          country = {competitor.country}
          />))}
      </tbody>
          
  </table>
  :"loading dashboard"}
  </div> 
  )
}

export default TheDashBoard
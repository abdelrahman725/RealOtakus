import EachNoti from "./EachNoti"
import { useEffect } from "react"
const Notifications = ({notifications}) => {
  
useEffect(()=>{
 console.log("notifications loaded")
},[])
  

  return (
    <div>
        {notifications.length>0?notifications.map((noti,index)=>(
              <EachNoti key={index} noti={noti.notification} time={noti.time}/>
          )): 
          <p>no activity yet</p>
          } 
    </div>
  )
}

export default Notifications
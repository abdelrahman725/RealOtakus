import EachNoti from "./EachNoti"
import async_http_request from "./AsyncRequest"
import { useEffect } from "react"

const Notifications = ({notifications,clear_unseen_count}) => {

useEffect(()=>{

  // clears unseen_notifcations count after user view them
  clear_unseen_count(0)
  
//update notifications state in the backend (which are seen by the user in the  UI) from unseen to seen 
  const new_notifications=[]
  
  notifications.map((n)=>(
    !n.seen&&new_notifications.push(n.id) 
  ))
  
  const UpdateNotificationsState = async(notifications)=>{

    const notifications_updated_response = await async_http_request({
      path :"update_notifications_state",
      method:"PUT",
      data : {"notifications":notifications}
    })
    
    console.log(notifications_updated_response)
  }

  new_notifications.length > 0 && UpdateNotificationsState(new_notifications)
 
},[])
  
  return (
    <div className="notifications">
      <br/>
        {notifications.length>0?notifications.map((noti,index)=>(

          <EachNoti key={index} noti={noti.notification} time={noti.time}/>
          )): 
          <p>no activity yet</p>
        } 
    </div>
  )
}

export default Notifications
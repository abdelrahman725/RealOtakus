import EachNoti from "./EachNoti"
import async_http_request from "./AsyncRequest"
import { useEffect } from "react"

const Notifications = ({all_notifications, unseen_count, clear_unseen_count}) => {

useEffect(()=>{
    
    if (unseen_count <= 0)
      return

    // clears unseen_notifcations count after user view them
    clear_unseen_count(0)
      
  //update notifications state fronend and backend (which are seen by the user in the  UI) from unseen to seen   
    const unseen_notifications = []
    
    all_notifications.map((n)=>
      !n.seen  && unseen_notifications.push(n.id)
    )

    const UpdateNotificationsState = async()=>{

      const notifications_updated_response = await async_http_request({
        path :"update_notifications_state",
        method:"PUT",
        data : {"notifications": unseen_notifications}
      })
    
      //console.log(notifications_updated_response)
    }

     UpdateNotificationsState()
  
},[all_notifications])
  
  return (
    <div className="notifications">
      <br/>
        {all_notifications.length>0?all_notifications.map((noti,index)=>(
          <EachNoti key={index} noti={noti.notification} time={noti.time}/>
          )): 
          <p>no activity yet</p>
        } 
    </div>
  )
}

export default Notifications
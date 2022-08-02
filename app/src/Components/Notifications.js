import EachNoti from "./EachNoti"
import getCookie from "../GetCookie"

import { useEffect,useContext } from "react"
import { ServerContext } from "../App"

const Notifications = ({notifications,clear_unseen_count}) => {
  
  const {server} = useContext(ServerContext)  
  const CsrfToken = getCookie('csrftoken')

useEffect(()=>{

// clears unseen_notifcations count after user view them
  clear_unseen_count(0)
  
//update notifications state in the backend (which are seen by the user in the  UI) from unseen to seen 
  const new_notifications=[]
  
  notifications.map((n)=>(
    !n.seen&&new_notifications.push(n.id) 
  ))
  

  const UpdateNotificationsState = async(notifications)=>{

    const send = await fetch(`${server}/home/update_notifications_state`,{
        method : 'PUT',
        headers : {
        'Content-type': 'application/json',
        'X-CSRFToken': CsrfToken,
        },
        body: JSON.stringify({
          notifications:notifications,
        })
    })

    const res  = await send.json()
    console.log(res)
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
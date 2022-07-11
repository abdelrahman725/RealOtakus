import EachNoti from "./EachNoti"
import { useEffect,useContext, useState } from "react"
import getCookie from "../GetCookie"
import { ServerContext } from "../App"


const Notifications = ({notifications}) => {
  
  const {server} = useContext(ServerContext)  
  const CsrfToken = getCookie('csrftoken')
  //const [loading,setloading]= useState()


useEffect(()=>{

// clears unseen_notifcations count after user view them
  document.getElementById("notifications_count").innerHTML =""

  
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


    UpdateNotificationsState(new_notifications)
  
 
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
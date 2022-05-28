import EachNoti from "./EachNoti"
const Notifications = ({notifications}) => {


  return (
    <div>
        {notifications.map((noti,index)=>(
              <EachNoti key={index} noti={noti.notification} time={noti.time}/>
          ))} 
    </div>
  )
}

export default Notifications
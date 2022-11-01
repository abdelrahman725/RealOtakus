import UtcToLocalTime from "./LocalDate"

const EachNotification = ({ noti, time, kind, onclick }) => {
  
  return (
    <div className="pointer_cursor notification" onClick={()=>onclick(kind)}>  
       <p> <strong>{noti}</strong> </p>
       <p className="notification_time">  {UtcToLocalTime(time)} </p>
    </div>        
  )
}

export default EachNotification
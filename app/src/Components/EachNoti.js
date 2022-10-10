import UtcToLocalTime from "./LocalDate"

const EachNoti = ({noti,time}) => {

  return (
  
    <div className="notification">  
     
       <p> <strong>{noti}</strong> </p>
       <p className="notification_time">  {UtcToLocalTime(time)} </p>
      <br />
    </div>
        
  )
}

export default EachNoti
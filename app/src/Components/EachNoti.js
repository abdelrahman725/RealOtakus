import { useEffect } from "react"

const EachNoti = ({noti,time}) => {

//this function does the following
// convert utc time (fetched from the server)to browswer local time
// convert the 24 hours to am/pm format
// uses the same format as youtube and other popular social media

const UTCToLocalTime = (utc_time)=>{
  
    const date_time = new Date(utc_time)
    const months_names = ["Jan","Feb","March","April","May","June","Jul","Aug","Sep","Oct","Nov","Dec"];
    let date = `${months_names[date_time.getMonth()]} ${date_time.getDate()}`
    
    const notification_year = date_time.getFullYear()
    const current_year = new Date().getFullYear()
    if (notification_year !== current_year)
    {
      date += ", " + notification_year
    }
    const time = date_time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

    return `${date} at ${time}`
  }

  
  return (
    <>
    <div className="notification">  
     {/* <div>
       {noti}
     </div> */}
      <div className="date_time">
      {UTCToLocalTime(time)}
      </div>
    </div>
        
      <br />
    </>
  )
}

export default EachNoti
import get_local_date from "./LocalDate"

const get_shown_notification = (anime,kind) =>{
    
  if (kind==="N"){
    return `${anime} has now has new questions`
  }
 
  if (kind==="R"){
    return `new question needs review for ${anime} `
  }
 
  if (kind==="A"){
    return `Congratulations! your contribution for ${anime} is approvd`
 
  }if (kind==="F"){
    return `Sorry your last contribution for ${anime} is rejected`
  }
}

const EachNotification = ({ notification, kind, time, navigate }) => {
  
  return (
    <div className="pointer_cursor notification" onClick={()=>navigate(kind,notification)}>  
       <p> 
        <strong>
        {kind ? get_shown_notification(notification,kind) : notification }
        </strong> 
       </p>
       <p className="notification_time"> {get_local_date(time,true)} </p>
    </div>        
  )
}

export default EachNotification
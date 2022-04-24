import Notifications from "./Notifications"

const Bar = ({data,country,noti,showprofile,switch_to_profile}) => {
  return (
    <div className="bar">
      <div onClick={()=>{showprofile(true); switch_to_profile("profile")} }>{data.username}</div>
      <div>{data.level}</div>
      <div>{country}</div>
      <div>{data.points}</div>
      <div>activity</div>
    </div>
  )
}

export default Bar
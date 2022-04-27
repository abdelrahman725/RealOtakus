import Notifications from "./Notifications"

const Bar = ({data,noti,showprofile}) => {
  return (
    <div className="bar">
      <div onClick={()=> showprofile("profile") }>{data.username}</div>
      <div>{data.level}</div>
      <div>{data.points}</div>
      <div>activity</div>
    </div>
  )
}

export default Bar
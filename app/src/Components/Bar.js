import Notifications from "./Notifications"

const Bar = ({data,noti,showprofile}) => {
  return (
    <div className="bar">
      <div>{data.level}</div>
      <div>{data.points}</div>
      <div>activity</div>
      <div onClick={ ()=> showprofile("profile") } className="profilename">{data.username}</div>
    </div>
  )
}

export default Bar
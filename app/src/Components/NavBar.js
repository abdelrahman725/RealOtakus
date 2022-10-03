const NavBar = ({data,notifications_open,show,new_notifications}) => {

  return (
    <div className="bar">
      <div>{data.level}</div>
      <div>{data.points}</div>
      
      <div className="notifications"
       onClick={ ()=> show("notifications")} >
       activity &nbsp;
      <strong>{new_notifications > 0 &&  !notifications_open && new_notifications}</strong>
      </div>

      <div onClick={ ()=> show("profile") } className="profilename">{data.username}</div>
    </div>
  )
}

export default NavBar
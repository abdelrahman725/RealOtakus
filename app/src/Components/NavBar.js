const NavBar = ({
  user,
  notifications_open,
  show,
  new_notifications
}) => {

return (
  <div className="navbar">
      
      <div className="pointer_cursor logo" onClick={ ()=> show("home")}>
        <strong>Real Otakus</strong>
      </div> 
    
    {user?
      <div className="header_data">       
        <div className="pointer_cursor" onClick={ ()=> show("notifications")} >
          <strong>
            {new_notifications > 0 &&  !notifications_open && new_notifications}
          </strong>
            &nbsp; notifications 
        </div>
        
        <div>{user.level}</div>
        
        <div className="pointer_cursor" onClick={ ()=> show("profile") }>
          {user.username} <strong>{user.points}</strong>
        </div>
      
      </div>
    :  <div className="header_data">loading</div>
    }
  </div>
)
 
}

export default NavBar
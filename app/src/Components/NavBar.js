import { IoMdNotifications } from 'react-icons/io'
import { BsPersonFill } from 'react-icons/bs'
import { MdLogout } from 'react-icons/md'
import { FiInfo } from 'react-icons/fi'
import { useRef } from 'react'
const NavBar = ({
  user,
  notifications_open,
  show,
  new_notifications,
  logout
}) => {
const username_ref = useRef(null)
return (
  <div className="navbar">
      
      <div>
        
        <div className="pointer_cursor logo" onClick={ ()=> show("home")}>
          <strong>Real Otakus</strong> 
        </div>
        
        <div>
         <FiInfo className="info icon" onClick={ ()=> show("info")}/>
        </div>
        
      </div> 
    
    {user?
      <div>       
        
        <div>
          <BsPersonFill className="icon" 
          onClick={ ()=> show("profile")}
          onMouseEnter = {()=>username_ref.current.style.color="white"}
          onMouseLeave = {()=>username_ref.current.style.color="#6e7174"}
          />
          <div style={{color:"#6e7174"}} ref={username_ref}>
            {user.username}
          </div>
        </div>

        <div className="notification">
          <strong style={{visibility: new_notifications > 0 && !notifications_open ? "visible":"hidden"}}>
             {new_notifications}
          </strong> 
          <IoMdNotifications className="icon" onClick={ ()=> show("notifications")}/>
        </div>

        <div>
          <MdLogout className="icon"  onClick={logout}/>
        </div>

      </div>
    :  <div className="header_data">loading</div>
    }
  </div>
)
 
}

export default NavBar
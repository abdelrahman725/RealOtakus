import { IoMdNotifications } from 'react-icons/io'
import { BsPersonFill } from 'react-icons/bs'
import { MdLogout } from 'react-icons/md'
import { FiInfo } from 'react-icons/fi'
import { MdDarkMode } from 'react-icons/md'
import { HiOutlineSun } from 'react-icons/hi'
import { useRef } from 'react'

import { Link } from 'react-router-dom'
import { domain } from './AsyncRequest'

const NavBar = ({
  user,
  notifications_open,
  new_notifications,
  darkmode,
  setdarkmode
}) => {
const username_ref = useRef(null)
return (
  <div className="navbar">
      
      <div className="left">

        <div>
          <Link to="/" className="logo">
            <strong className="logo_text"> <span>R</span>eal <span>O</span>takus </strong> 
          </Link>
        </div>
        
        <div>
        <Link to="about">
          <FiInfo className="about icon"/>
        </Link>
        </div>
    
      </div> 
    
    {user?
      <div className="right">       
        
        <div>
          <Link to="profile">
            <BsPersonFill className="icon" 
            onMouseEnter = {()=>username_ref.current.style.color="white"}
            onMouseLeave = {()=>username_ref.current.style.color="#6e7174"}/>
          </Link>
          
          <div style={{color:"#6e7174"}} ref={username_ref}>
            {user.username}
          </div>
        </div>
        
        <div className="notification">
          <strong style={{visibility: new_notifications > 0 && !notifications_open ? "visible":"hidden"}}>
             {new_notifications}
          </strong> 

        <Link to="notifications">
          <IoMdNotifications className="icon" />
        </Link>
        </div>
        
        <div>
          {darkmode  && <HiOutlineSun className="icon" onClick={()=> setdarkmode(false)}/>}
          {!darkmode && <MdDarkMode className="icon" onClick={()=> setdarkmode(true)}/>}
        </div>

        <div>
          <MdLogout className="icon"  onClick={()=> window.location.href = `http://${domain}/logout`}/>
        </div>

      </div>
    : <div className="header_data">loading</div>
    }
  </div>
)
 
}

export default NavBar
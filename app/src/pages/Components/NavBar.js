import { IoMdNotifications } from 'react-icons/io'
import { BsPersonFill } from 'react-icons/bs'
import { MdLogout } from 'react-icons/md'
import { FiInfo } from 'react-icons/fi'
import { MdDarkMode } from 'react-icons/md'
import { HiOutlineSun } from 'react-icons/hi'

import { Link, useNavigate } from 'react-router-dom'
import { domain } from './AsyncRequest'

const NavBar = ({
  user,
  notifications_open,
  new_notifications,
  darkmode,
  setdarkmode
}) => {

  const naviage_routes = useNavigate()

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
            <FiInfo className="nav_icon"/>
          </Link>
        </div>

      </div>

      {user ?
        <div className="right">

          <div>
            <Link to="profile">
              <BsPersonFill className="nav_icon" />
            </Link>
            <div className="icon" onClick={()=>naviage_routes("/profile")}>
              {user.username}
            </div>
          </div>

          <div className="notification">
            <strong style={{ visibility: new_notifications > 0 && !notifications_open ? "visible" : "hidden" }}>
              {new_notifications}
            </strong>

            <Link to="notifications">
              <IoMdNotifications className="nav_icon" />
            </Link>
          </div>

          <div>
            {darkmode && <HiOutlineSun className="nav_icon" onClick={() => setdarkmode(false)} />}
            {!darkmode && <MdDarkMode className="nav_icon" onClick={() => setdarkmode(true)} />}
          </div>

          <div>
            <MdLogout className="nav_icon" onClick={() => window.location.href = `http://${domain}/logout`} />
          </div>

        </div>
        : <div className="header_data">loading</div>
      }
    </div>
  )

}

export default NavBar
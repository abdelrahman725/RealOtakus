import { IoMdNotifications } from 'react-icons/io'
import { BsPersonFill } from 'react-icons/bs'
import { FiInfo } from 'react-icons/fi'
import { MdDarkMode, MdLogout } from 'react-icons/md'
import { HiOutlineSun } from 'react-icons/hi'

import { Link } from 'react-router-dom'

const NavBar = ({
  user,
  notifications_open,
  new_notifications,
  darkmode,
  setdarkmode
}) => {


  return (
    <div className="navbar">

      <div className="left">
        <div>
          <Link to="/" className="logo">
            <strong className="logo_text">Real Otakus</strong> &nbsp;
          </Link>
        </div>

        <div>
          <Link to="about">
            <FiInfo className="nav_icon" />
          </Link>
        </div>

      </div>

      {user ?
        <div className="right">
          <div>
            <Link to="profile">
              <BsPersonFill className="nav_icon" />
            </Link>
          </div>

          <div className="notification">
            <strong className="n_notifications"
              style={{ visibility: new_notifications > 0 && !notifications_open ? "visible" : "hidden" }}>
              {new_notifications}
            </strong>

            <Link to="notifications">
              <IoMdNotifications className="nav_icon" />
            </Link>
          </div>

          {/* <div>
            {darkmode &&  <HiOutlineSun className="nav_icon" onClick={() => setdarkmode(false)} />}
            {!darkmode && <MdDarkMode className="nav_icon" onClick={() => setdarkmode(true)} />}
          </div> */}

          <div>
            <MdLogout className="nav_icon" onClick={() => window.location.href = `/logout`} />
          </div>

        </div>
        : <div className="header_data">loading</div>
      }
    </div>
  )

}

export default NavBar
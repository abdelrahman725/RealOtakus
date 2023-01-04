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
  game_started,
  darkmode,
  setdarkmode
}) => {


  return (
    <div className={`navbar ${game_started === true && "disabled_div"}`}>

      <div className="left" >
        <div>
          <Link to="/" className="logo" tabIndex={game_started === true ? -1 : 1}>
            <strong className="logo_text">Real Otakus</strong> &nbsp;
          </Link>
        </div>

        <div>
          <Link to="about" tabIndex={game_started === true ? -1 : 1}>
            <FiInfo className="nav_icon about_icon" />
          </Link>
        </div>

      </div>

      {user ?
        <div className="right">
          <div>
            <Link to="profile" tabIndex={game_started === true ? -1 : 1}>
              <BsPersonFill className="nav_icon" />
            </Link>
          </div>

          <div className="notification">
            <strong className="n_notifications"
              style={{ visibility: new_notifications > 0 && !notifications_open ? "visible" : "hidden" }}>
              {new_notifications}
            </strong>

            <Link to="notifications" tabIndex={game_started === true ? -1 : 1}>
              <IoMdNotifications className="nav_icon" />
            </Link>
          </div>

          {/* <div>
            {darkmode &&  <HiOutlineSun className="nav_icon" onClick={() => setdarkmode(false)} />}
            {!darkmode && <MdDarkMode className="nav_icon" onClick={() => setdarkmode(true)} />}
          </div> */}

          <div>
            <Link tabIndex={game_started === true ? -1 : 1} >
              <MdLogout className="nav_icon" onClick={() => window.location.href = '/logout'} />
            </Link>
          </div>

        </div>
        : <div className="header_data">loading</div>
      }
    </div>
  )

}

export default NavBar
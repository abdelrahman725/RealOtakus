import { IoMdNotifications } from 'react-icons/io'
import { BsPersonFill } from 'react-icons/bs'
import { FiInfo } from 'react-icons/fi'
import { MdLogout } from 'react-icons/md'

//import { MdDarkMode } from 'react-icons/md'
//import { HiOutlineSun } from 'react-icons/hi'

import { Link } from 'react-router-dom'

const NavBar = ({
  authenticated,
  notifications_open,
  new_notifications,
  game_started,
  log_user_out,
  //darkmode,
  //setdarkmode
}) => {


  return (
    <div className={`navbar ${game_started && "disabled_div"}`}>

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

      <div className="right">
        <div>
          <Link to={authenticated ? "profile" : "/"} tabIndex={game_started === true ? -1 : 1}>
            <BsPersonFill className="nav_icon" />
          </Link>
        </div>

        <div className="notification">
          <strong className="n_notifications"
            style={{ visibility: new_notifications > 0 && !notifications_open ? "visible" : "hidden" }}>
            {new_notifications}
          </strong>

          <Link to={authenticated ? "notifications" : "/"} tabIndex={game_started === true ? -1 : 1}>
            <IoMdNotifications className="nav_icon" />
          </Link>
        </div>

        {/* <div>
            {darkmode &&  <HiOutlineSun className="nav_icon" onClick={() => setdarkmode(false)} />}
            {!darkmode && <MdDarkMode className="nav_icon" onClick={() => setdarkmode(true)} />}
          </div> */}

        <div>
          <Link onClick={log_user_out} tabIndex={game_started === true ? -1 : 1} >
            <MdLogout className="nav_icon" />
          </Link>
        </div>

      </div>

    </div>
  )

}

export default NavBar
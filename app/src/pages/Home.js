import DashBoard from './components/DashBoard'
import NotAuthenticated from './NotAuthenticated'
import { FcIdea, FcDatabase } from 'react-icons/fc'
import { GlobalStates } from 'App'
import { useContext } from 'react'
import { MdQuiz, MdOutlineRateReview } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const Home = ({ user_data, dashboard_users }) => {

  const { authenticated } = useContext(GlobalStates)
  const naviage_routes = useNavigate()

  return (

    <div className="home">

      {authenticated ?
        <div className="navigation_buttons">

          <button onClick={() => naviage_routes("contribute")}>
            <FcIdea className="icon" />Contribute
          </button>

          <button onClick={() => naviage_routes("game")}>
            <MdQuiz className="icon" />Take Quiz
          </button>

          <button onClick={() => naviage_routes("mycontributions")}>
            <FcDatabase className="icon" /> My Contributions
          </button>

          {user_data.is_reviewer &&
            <button onClick={() => naviage_routes("review")}>
              <MdOutlineRateReview className="icon" /> Review
            </button>
          }
        </div>
        :
        <NotAuthenticated />
      }

      {dashboard_users &&
        <DashBoard dashboard_users={dashboard_users} current_user={user_data} authenticated={authenticated} />
      }

    </div>
  )
}

export default Home

import TheDashBoard from './components/TheDashBoard'
import NotAuthenticated from './NotAuthenticated'
import { FcIdea, FcDatabase } from 'react-icons/fc'
import { GlobalStates } from 'App'
import { useContext } from 'react'
import { MdQuiz, MdOutlineRateReview } from 'react-icons/md'
import { Link } from 'react-router-dom'

const Home = ({ user_data, dashboard_users }) => {

  const { authenticated } = useContext(GlobalStates)

  return (

    <div className="home">

      {authenticated ?

        <div className="navigation_buttons">
          <Link to="contribute">
            <button>
              <FcIdea className="icon" />Contribute
            </button>
          </Link>

          <Link to="game">
            <button>
              <MdQuiz className="icon" />Take Quiz
            </button>
          </Link>

          <Link to="mycontributions">
            <button>
              <FcDatabase className="icon" /> My Contributions
            </button>
          </Link>

          {user_data.is_reviewer &&
            <Link to="review">
              <button>
                <MdOutlineRateReview className="icon" /> Review
              </button>
            </Link>
          }
        </div>
        :
        <NotAuthenticated />
      }
   
      {dashboard_users && dashboard_users.length > 0 &&
        <TheDashBoard dashboard_users={dashboard_users} current_user={user_data} />
      }

    </div>
  )
}

export default Home

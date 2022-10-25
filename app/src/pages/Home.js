
import TheDashBoard from "./Components/TheDashBoard"
import { Link } from 'react-router-dom'

import { FcIdea } from 'react-icons/fc'
import { FcDatabase } from 'react-icons/fc'
import { MdQuiz } from 'react-icons/md'
import { FaEye } from 'react-icons/fa'

const Home = ({user_data, dashboard_users}) => {
       
return (

  <div className="home">
    
    <div className="navigation_buttons"> 

        <Link to="contribute">
          <button>
            <FcIdea className="icon"/> Contribute
          </button> 
        </Link>

        <Link to="game">
          <button>
            <MdQuiz className="icon"/> Start Quiz
          </button> 
        </Link>

        <Link to="mycontributions">
          <button>
            <FcDatabase className="icon"/> My Contributions
          </button> 
        </Link>

        {user_data && user_data.is_reviewer &&  
          <Link to="review">
            <button>
              <FaEye className="icon"/> Review Contributions
            </button>
          </Link> } 

    </div>
    
    <TheDashBoard dashboard_users={dashboard_users} current_user= {user_data && user_data.id} /> 
  
  </div>
 )
}

export default Home

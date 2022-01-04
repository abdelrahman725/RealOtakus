import {Button} from '@material-ui/core'
const Profile = ({tests_started, tests_completed, best_score, logout})=>
{
  return(
    <div className="Profile">
      <Button 
            className="ButtonChild"
            onClick={logout} 
            size="small"
            variant="contained"  >
              Logout
      </Button>
      <p> tests started   : {tests_started}</p>
      <p> tests completed : {tests_completed}</p>
      <p> Highest score   : {best_score}</p>
    </div>
  )

}

export default Profile
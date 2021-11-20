import {Button} from '@material-ui/core'
const Profile = ({tests_started, tests_completed, best_score, logout})=>
{
  return(
    <div className="Profile">
      <p> tests started   : {tests_started}</p>
      <p> tests completed : {tests_completed}</p>
      <p> best quiz score : {best_score}</p>
      <Button 
            className="ButtonChild"
            onClick={logout} 
            size="small"
            variant="contained"  >
              Logout
      </Button>
    </div>
  )

}

export default Profile
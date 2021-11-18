import {Button} from '@material-ui/core'
const Profile = ({tests_count, logout})=>
{
  return(
    <div className="Profile">
      <p>number of tests : {tests_count}</p>
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
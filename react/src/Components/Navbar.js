import PersonIcon   from '@material-ui/icons/Person'
const Navbar = ({username,level,points,showprofile})=>
{
  return(
    <div className="Navbar">
        <div className="UserName" onClick={showprofile} >
          <PersonIcon  className="PersonIcon"/>
          {username} 
        </div>

        <div className="points">
          points :<strong> {points} </strong>
        </div>
        <div className="level">
          {level} 
        </div>

    </div>
  )
}
export default Navbar

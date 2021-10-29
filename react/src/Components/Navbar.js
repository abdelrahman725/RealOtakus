import PersonIcon   from '@material-ui/icons/Person'
const Navbar = ({username,level,points,showprofile})=>
{
  return(
    <div className="Navbar">
          <div className="Logo">
            <strong>Anime challenge  </strong>
        </div>

        <div className="UserName" onClick={showprofile} >
          <PersonIcon  className="PersonIcon"/>
          {username} 
        </div>
        <div className="points">
          score &nbsp;<strong> {points} </strong>
        </div>
        <div className="level">
          {level} 
        </div>

    </div>
  )
}
export default Navbar

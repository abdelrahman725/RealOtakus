
const Navbar = ({username,level,points})=>
{
  return(
    <div className="Navbar">
        {username} , 
        {level} , 
        {points}
    </div>
  )
}
export default Navbar


const Profile = ({name,level,points,highest_score})=>
{
  return(
    <div className="Profile">
     <p>{name} profile</p>
     <p>level : {level} </p>
     <p>points: {points} </p>
     <p>highest_score:  {highest_score} </p>

    </div>
  )

}

export default Profile
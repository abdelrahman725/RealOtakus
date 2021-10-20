
const Profile = ({level,top_animes,tests_count,loading})=>
{
  return(
    <div className="Profile">
     <p>level : {level} </p>
 
     <p>number of tests : {tests_count}</p>
     {loading===false&&top_animes.map((topanime)=>(
       <p>
         {topanime.anime_name}
       </p>

     ))}
    </div>
  )

}

export default Profile
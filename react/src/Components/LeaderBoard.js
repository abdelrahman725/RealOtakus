import Competitor  from "./Competitor";

const LeaderBoard = ({otakus})=>
{
  return(
    <div className="LeaderBoard">
      <hr/>
      This is the leader board and contains the following competitors:
       {otakus.map( (otaku) =>(
         <Competitor key={otaku.id}
         name = {otaku.username} points = {otaku.points}/>
       ))}
       <hr/>
    </div>
  )
}
export default LeaderBoard;

import Competitor from "./Competitor"

const DashBoard = ({competitors}) => {
  return (
    <> 
     {competitors.map((competitor)=> (
     <Competitor
      key={competitor.id} 
      name={competitor.username}
      points={competitor.points}
      level={competitor.level}
      contributor={competitor.contributor}
     />
     ))}
    </>
  )
}

export default DashBoard
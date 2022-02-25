import Competitor from "./Competitor"

const Competitors = ({competitors}) => {
  return (
    <> 
     {competitors.map((competitor)=> (
     <Competitor
      key={competitor.id} 
      name={competitor.username}
      points={competitor.points}
      level={competitor.level}
     />
     ))}
    </>
  )
}

export default Competitors
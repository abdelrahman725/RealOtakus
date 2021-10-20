
const Competitor = ({name,points})=>{
  return (
    <div className="Competitor">
       <p> <strong> {name} </strong>
           with <strong> {points} </strong>points
      </p>
    </div>
  )
}

export default Competitor
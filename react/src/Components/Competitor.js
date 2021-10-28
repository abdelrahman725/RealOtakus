
const Competitor = ({name,points,level})=>{
  return (
    <tr className="Competitor">
       <td>{name} </td>
       <td>{points}</td>
       <td>{level}</td>
    </tr>
  )
}

export default Competitor
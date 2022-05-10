const Competitor = ({name,points,level,country,contributions}) => {
  return (
    
  <tr>
    <td className="ok">{name}</td>
    <td>{points}</td>
    <td>{level}</td>
    <td>{contributions}</td>
    <td>        
        {country? <img
        src= {`https://flagcdn.com/256x192/${country}.png`}
        width="32"
        height="24"
        alt="">
        </img>: "N/A"}
    </td>
  </tr>
    
  )
}

export default Competitor
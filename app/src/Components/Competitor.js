const Competitor = ({name,points,level,country,contributions}) => {
  return (
    
  <tr>
    <td>{name}</td>
    <td>{points}</td>
    <td>{level}</td>
    <td>        
        <img
        src= {`https://flagcdn.com/256x192/${country}.png`}
        width="32"
        height="24"
        alt="">
        </img>
    </td>
    <td>{contributions}</td>
      </tr>
    
  )
}

export default Competitor
import { FaCrown } from 'react-icons/fa'

const Competitor = ({name, points, level, country, contributions, index, current_user}) => {

  return (
    <tr className={current_user ? "current_user":""}>
      <td className={index===0 ? "top_competitor":""}>
      {index === 0 &&  <FaCrown className="top_competitor_icon"/>}
        {name}
      </td>
      <td>{points}</td>
      <td>{level}</td>
      <td>{contributions}</td>
      <td>        
      {country&& <img src={`https://flagcdn.com/256x192/${country}.png`} width="32"height="24"></img>}
      </td>
    </tr>

  )
}

export default Competitor
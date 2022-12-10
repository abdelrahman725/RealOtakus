const Competitor = ({ index, name, points, level, country, contributions, current_user }) => {

  return (
    <tr className={current_user ? "current_user" : ""}>
      <td className="user_order">{index + 1}</td>
      <td>{name}</td>
      <td>{points}</td>
      <td>{level}</td>
      <td>{contributions}</td>
      <td>
        {country &&
          <img src={`https://flagcdn.com/256x192/${country}.png`} width="32" height="24"></img>
        }
      </td>
    </tr>

  )
}

export default Competitor
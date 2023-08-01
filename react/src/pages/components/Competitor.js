const Competitor = ({ index, name, points, level, country_code, country_name, contributions, current_user }) => {

  return (
    <tr className={current_user ? "current_user" : ""}>
      <td className="user_order">{index + 1}</td>
      <td>{name}</td>
      <td>{points}</td>
      <td>{level}</td>
      <td>{contributions}</td>
      <td>
        {country_code &&
          <img src={`https://flagcdn.com/256x192/${country_code}.png`} alt="country_flag" width="32" height="24" title={country_name}></img>
        }
      </td>
    </tr >

  )
}

export default Competitor
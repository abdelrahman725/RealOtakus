
const EachAnime = ({anime,contributions}) => {
  return (
    <tr>
        <td>{anime}</td>
        <td>{contributions}</td>
        <td>{contributions>=5?"yes":"no"}</td>
    </tr>
  )
}

export default EachAnime
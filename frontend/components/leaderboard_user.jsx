export default function Otaku({ index, competitor, country_name, current_user }) {

    return (
        <tr className={current_user ? "current_user" : ""}>
            <td className="user_order">{index + 1}</td>
            <td>{competitor.username}</td>
            <td>{competitor.score}</td>
            <td>{competitor.level}</td>
            <td>{competitor.n_contributions}</td>
            <td>
                {competitor.country &&
                    <img
                        src={`https://flagcdn.com/256x192/${competitor.country}.png`}
                        width={32}
                        height={24}
                        alt="country flag"
                        title={country_name}
                    />
                }
            </td>

        </tr >

    )
}


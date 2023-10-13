export default function Interactions({ interactions, quiz_score_percentage }) {
    return (
        <div className="interactions dashboard_container">
            <h2>Quizes history</h2>

            {interactions ?
                interactions.length > 0 ?
                    <div className="dashboard_container"><table className="dashboard">
                        <thead>
                            <tr>
                                <th> anime</ th>
                                <th className="correct"> correct answers </th>
                                <th className="wrong"> wrong answers</th>
                            </tr>
                        </thead>
                        <tbody>
                            {interactions.map((anime, index) => (
                                <tr key={index}>
                                    <td>{anime[0]}</td>
                                    <td>{anime[1]["correct"]}</td>
                                    <td>{anime[1]["wrong"]}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td>Score Percentage</td>
                                <td></td>
                                <td>{quiz_score_percentage} %</td>
                            </tr>
                        </tfoot>
                    </table></div>
                    :
                    "no quizes yet"
                : "loading"
            }
        </div>
    )
}

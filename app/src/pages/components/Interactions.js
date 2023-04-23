import React from 'react'

const Interactions = ({ interactions }) => {
  return (
    <div className="interactions">
      <h2>Tests insights</h2>
      {interactions.length > 0 ?
        <table className="dashboard">
          <thead>
            <tr>
              <th> anime</ th>
              <th> right answers </th>
              <th> wrong/no  &nbsp;answers</th>
            </tr>
          </thead>

          <tbody>
            {interactions.map((anime, index) => (
              <tr key={index}>
                <td>{anime[0]}</td>
                <td>{anime[1]["correct"]}</td>
                <td>{anime[1]["not_correct"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        :
        "no games yet"
      }
    </div>
  )
}

export default Interactions
import React from 'react'

const Interactions = ({ interactions }) => {
  return (
    <div className="interactions">
      <h2>Games insights</h2>
      {Object.keys(interactions).length > 0 ?
        <table className="dashboard">
          <thead>
            <tr>
              <th> anime</ th>
              <th> right answers </th>
              <th> wrong/no  &nbsp;answers</th>
            </tr>
          </thead>

          <tbody>
            {Object.keys(interactions).map((anime, index) => (
              <tr key={index}>
                <td>{anime}</td>
                <td>{interactions[anime].correct}</td>
                <td>{interactions[anime].not_correct}</td>
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
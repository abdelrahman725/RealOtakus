import React from 'react'

const Interactions = ({interactions}) => {
  return (
    <div className="interactions">
      <h2>interactions</h2> 
      <table className="dashboard">
        <thead>
          <tr>
            <th> anime</ th>
            <th> right answers </th>
            <th> wrong/no  &nbsp;answers</th>
          </tr>
        </thead>
        
        <tbody>  
          {Object.keys(interactions).map((anime ,index) => (
            <tr key={index}>
              <td>{anime}</td>
              <td>{interactions[anime].correct}</td>
              <td>{interactions[anime].not_correct}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Interactions
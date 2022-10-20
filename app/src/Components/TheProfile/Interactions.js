import React from 'react'

const Interactions = ({interactions}) => {
  return (
    <>

      <h2>interactions</h2>

      <table className="dashboard interactions">
        <thead>
          <tr>
            <th> anime</ th>
            <th> right answers </th>
            <th> wrong/no  &nbsp;answers</th>
          </tr>
        </thead>
        
        <tbody>  

          {interactions.map((interaction, index) => (  
            <tr key={index}>
              <td>{interaction.anime_name}</td>
              <td>{interaction.right_answers}</td>
              <td>{interaction.not_right_answers}</td>
            </tr>
              
          ))}
        
        </tbody>
    
      </table>
      
    </>
  )
}

export default Interactions
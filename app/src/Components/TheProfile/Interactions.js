import React from 'react'

const Interactions = ({interactions}) => {
  return (

    <div className="interactions">
      <h1>interactions</h1>
      {interactions.map((interaction, index) => (
        
          <div key={index}>
            {interaction.anime_name}
          </div>
        
      ))
      }
    </div>
  )
}

export default Interactions
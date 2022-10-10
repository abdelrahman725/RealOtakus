import React from 'react'

const Interactions = ({interactions}) => {
  return (
    <div>
      <h1>interactions</h1>
      {interactions.map((interaction, index) => (
        
          <p>{interaction.anime_name}</p>
        
      ))
      }
    </div>
  )
}

export default Interactions
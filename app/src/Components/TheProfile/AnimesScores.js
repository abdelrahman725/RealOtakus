import React from 'react'

const AnimesScores = ({animes}) => {
  return (
    <div>
        <h2>progress on each anime</h2>
        <div>
            {animes.map((anime)=>(
                <p>{anime.anime.anime_name} &nbsp;
                    <span>
                    {(anime.score/(anime.gamesnumber*5))*100+" %"}
                    </span>
                </p>

            ))}
        </div>
    </div>
  )
}

export default AnimesScores
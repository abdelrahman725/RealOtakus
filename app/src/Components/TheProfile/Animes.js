import React from 'react'
import EachAnime from './EachAnime'

const Animes = ({animes,N_Contributions}) => {
  return (
    <div>
      <h2>animes you made contributions to</h2>
        {animes.length>0?
      <>
      <p>you have total of <strong>{N_Contributions}</strong>  contributions  </p>
      <table className="animesboard">
          <thead>
            <tr>
              <th className="head">anime</th>
              <th className="head">contributions</th>
              <th className="head">reviewer</th>
            </tr>
          </thead>
        <tbody>  
          {animes&&animes.map((anime ,index)=> (    
          <EachAnime
          key={index}
          anime={anime.anime.anime_name}
          contributions={anime.contributions}/>
          ))}
        </tbody>
      </table>
      </>
      :"you haven't contributed to any animes yet"}
    </div>
  )
}

export default Animes
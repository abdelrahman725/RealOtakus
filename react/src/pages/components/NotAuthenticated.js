import React from 'react'
import AuthenticatingForms from './AuthenticatingForms'

const NotAuthenticated = () => {
  return (
    <div className="not_authenticated">
      <h1>Welcome to the home of all Otakus</h1>
      <div className="container">
        <div className="about">
          <h3 className="title_color">What to do here as an otaku : </h3>
          <p>Test your otaku skills by taking mind blowing quizes in your favorite animes.</p>
          <p>Create an anime question of your own, so it can appear in others quizes.</p>
          <p>Become a reviewr by reviewing other users contributed questions.</p>
        </div>
        <AuthenticatingForms />
      </div>
    </div>
  )
}

export default NotAuthenticated
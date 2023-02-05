import React from 'react'
import AuthenticatingForms from './components/AuthenticatingForms'

const NotAuthenticated = () => {
  return (
    <div className="not_authenticated">
      <h1>So you are a real Otaku </h1>

      <div className="container">

        <div className="about">
          <h3 className="title_color">what can you do</h3>
          <p>Test yourself by taking quizes in your favorite animes</p>
          <p>Contribute a new question so other otakus can test themselves</p>
          <p>Become a reviewr by reviewing other users contributed questions !</p>
        </div>

        <AuthenticatingForms />
      </div>
    </div>
  )
}

export default NotAuthenticated
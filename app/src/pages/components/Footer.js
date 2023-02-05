import React from 'react'
import { Link } from 'react-router-dom'


const Footer = () => {
  return (
    <footer>
      <a className="simple_link" href="https://github.com/abdelrahman725/RealOtakus" target="_blank" rel="noreferrer">
        Github
      </a>

      <a className="simple_link" href="https://twitter.com/RealOtakus" target="_blank" rel="noreferrer">
        Twitter
      </a>

      {/* <a className="simple_link" href="/" target="_blank" rel="noreferrer">
        Support
      </a> */}

      <Link to="privacy" className="simple_link">privacy</Link>

      <Link to="terms" className="simple_link">terms</Link>

    </footer>
  )
}

export default Footer
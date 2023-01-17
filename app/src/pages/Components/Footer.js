import React from 'react'

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

      <a className="simple_link" href="/privacy" target="_blank">privacy</a>
      <a className="simple_link" href="/terms" target="_blank">terms</a>

    </footer>
  )
}

export default Footer
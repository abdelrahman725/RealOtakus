import React from 'react'
import { domain } from './AsyncRequest'

const Footer = () => {
  return (
    <footer>
      <a href={domain} target="_blank" rel="noreferrer">
        Github
      </a>

      <a href={domain} target="_blank" rel="noreferrer">
        Contact us
      </a>

      <a href={domain} target="_blank" rel="noreferrer">
        Support
      </a>

      <a href={domain} target="_blank" rel="noreferrer">
        Privacy policy
      </a>
    </footer>
  )
}

export default Footer
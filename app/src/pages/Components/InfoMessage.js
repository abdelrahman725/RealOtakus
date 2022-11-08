import React from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'

const InfoMessage = ({msg,close}) => {
  return (
    <div className="info_container">
    <AiOutlineCloseCircle className="close_icon" onClick={close}/>
     <p> {msg} </p>
  </div>
  )
}

export default InfoMessage
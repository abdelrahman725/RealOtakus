import React from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'

const InfoMessage = ({msg,close,title}) => {
  return (
    <div className="info_container">
    <AiOutlineCloseCircle className="close_icon" onClick={close}/>
     {title&&<p><strong>{title}</strong></p>}
     <p>{msg}</p>
  </div>
  )
}

export default InfoMessage
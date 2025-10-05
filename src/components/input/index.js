import React from 'react'
import "./input.css"
const Input = ({label, state, setState , placeholder, type}) => {
  return (
    <div className="input-wraper">
      <p className='input-lable'>{label}</p>
      <input 
        className='custom-input' 
        type={type}
        value={state}
        placeholder={placeholder}
        onChange={(e) => setState(e.target.value)}
      />
    </div>
  )
}

export default Input

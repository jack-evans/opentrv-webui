import React from 'react'
import { OverflowMenu, OverflowMenuItem } from 'carbon-components-react'

const DeviceTile = ({ name, temp, active }) => {
  return (
    <div className='DeviceTile'>
      <div className='DeviceTile__overflow-container'>
        <OverflowMenu className='DeviceTile__overflow-menu'>
          <OverflowMenuItem />
        </OverflowMenu>
      </div>
      <div className='DeviceTile__name-container'>
        <h3>{name}</h3>
      </div>
      <h3>{temp} degrees</h3>
      <h3>{active.toString()}</h3>
    </div>
  )
}

export default DeviceTile

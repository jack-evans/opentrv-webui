import React from 'react'
import { Icon, OverflowMenu, OverflowMenuItem } from 'carbon-components-react'

const DeviceTile = ({ name, temp, active }) => {
  let activity

  if (active) {
    activity = (
      <div className='DeviceTile__footer-active'>
        <div className='DeviceTile__footer-active-circle' />
        <h3>Active</h3>
      </div>
    )
  } else {
    activity = (
      <div className='DeviceTile__footer-idle'>
        <div className='DeviceTile__footer-idle-circle' />
        <h3>Idle</h3>
      </div>
    )
  }

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
      <div className='DeviceTile__icon-container'>
        <div className='DeviceTile__icon-circle'>
          <div>
            <Icon name='devices' />
          </div>
        </div>
      </div>
      <div className='DeviceTile__footer'>
        {activity}
        <div className='DeviceTile__footer-temp'>
          <h3>{temp}&#176;C</h3>
        </div>
      </div>
    </div>
  )
}

export default DeviceTile

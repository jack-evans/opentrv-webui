import React from 'react'
import { Icon, OverflowMenu, OverflowMenuItem } from 'carbon-components-react'

const DeviceTile = ({ name, temp, active }) => {
  let activityClassName = active ? 'DeviceTile__footer-active' : 'DeviceTile__footer-idle'
  let activityCircleClassName = active ? 'DeviceTile__footer-active-circle' : 'DeviceTile__footer-idle-circle'
  let activityContent = active ? 'Active' : 'Idle'

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
        <div className={activityClassName}>
          <div className={activityCircleClassName} />
          <h3>{activityContent}</h3>
        </div>
        <div className='DeviceTile__footer-temp'>
          <h3>{temp}&#176;C</h3>
        </div>
      </div>
    </div>
  )
}

export default DeviceTile

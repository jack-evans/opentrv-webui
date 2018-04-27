import React from 'react'
import { Icon, OverflowMenu, OverflowMenuItem } from 'carbon-components-react'

const PolicyTile = ({ id, name, temp, active, handleDelete }) => {
  let activityClassName = active ? 'PolicyTile__footer-active' : 'PolicyTile__footer-idle'
  let activityCircleClassName = active ? 'PolicyTile__footer-active-circle' : 'PolicyTile__footer-idle-circle'
  let activityContent = active ? 'Active' : 'Idle'

  let href = `/policy/${id}`
  return (
    <div className='PolicyTile'>
      <div className='PolicyTile__overflow-container'>
        <OverflowMenu className='PolicyTile__overflow-menu'>
          <OverflowMenuItem className='PolicyTile__overflow-menu-view' itemText='View' onClick={() => { window.location.assign(href) }} />
          <OverflowMenuItem className='PolicyTile__overflow-menu-delete' itemText='Delete' hasDivider isDelete onClick={handleDelete} />
        </OverflowMenu>
      </div>
      <div className='PolicyTile__center-container' style={{cursor: 'pointer'}} onClick={() => { window.location.assign(href) }}>
        <div className='PolicyTile__name-container'>
          <h3>{name}</h3>
        </div>
        <div className='PolicyTile__icon-container'>
          <div className='PolicyTile__icon-circle'>
            <div>
              <Icon
                name='schematics'
                description='Policys icon'
              />
            </div>
          </div>
        </div>
      </div>
      <div className='PolicyTile__footer'>
        <div className={activityClassName}>
          <div className={activityCircleClassName} />
          <h3>{activityContent}</h3>
        </div>
        <div className='PolicyTile__footer-temp'>
          <h3>{temp}&#176;C</h3>
        </div>
      </div>
    </div>
  )
}

export default PolicyTile

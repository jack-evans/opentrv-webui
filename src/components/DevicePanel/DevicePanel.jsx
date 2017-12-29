import React, { Component } from 'react'
import { Icon } from 'carbon-components-react'

class DevicePanel extends Component {
  constructor (props) {
    super(props)
    this.deviceId = props.match.params.id
  }

  /**
   * render method
   *
   * renders Another display panel component of the UI experience
   * @returns {HTML} - DevicePanel component
   */
  render () {
    return (
      <div className='DevicePanel'>
        <div className='DevicePanel__header-container'>
          <a className='DevicePanel__header-back-button' href='/'>
            <Icon name='arrow--left' />
            <h3>Device Overview</h3>
          </a>
        </div>
      </div>
    )
  }
}

export default DevicePanel

import React, { Component } from 'react'
import OverviewHeader from '../OverviewHeader/OverviewHeader'
import { Button, Search } from 'carbon-components-react'
import { DeviceTile } from '../DeviceTile/DeviceTile'

const returnedDevices = [{
  name: 'Device 1',
  active: true,
  currentTemperature: 26.2
}, {
  name: 'Device 2',
  active: false,
  currentTemperature: 23.5
}, {
  name: 'Device 3',
  active: true,
  currentTemperature: 21.9
}, {
  name: 'Device 4',
  active: true,
  currentTemperature: 25.2
}]

class Overview extends Component {
  constructor (props) {
    super(props)
    let devices = Overview.retrieveDevices()
    this.state = {
      devices: devices,
      visibleDevices: devices
    }
  }

  static searchOnChangeHandler (event) {
    console.log(event.target.value)
  }

  static discoverDevicesButtonOnClickHandler () {
  }

  static retrieveDevices () {
    return returnedDevices
  }

  /**
   * render method
   *
   * renders the overview component of the UI experience
   * @returns {HTML} - Overview component
   */
  render () {
    let overviewContent
    let overviewContentClass = 'Overview__content'

    if (this.state.devices.length < 1) {
      overviewContentClass += ' Overview__content-empty'
      overviewContent = (
        <div>
          <div className='Overview__content-empty-message'>
            <h3>You currently do not have any devices registered</h3>
          </div>
          <div>
            <Button
              className='Overview__discover_button'
              icon='add--outline'
              iconDescription='Add devices'
              onClick={() => console.log('button clicked')}
            >
              Discover my devices
            </Button>
          </div>
        </div>
      )
    } else {
      // This is where the tiles for each device are build up
      this.state.visibleDevices.forEach(device => {
        overviewContent = (
          <div>
            <DeviceTile name={device.name} temp={device.currentTemperature} active={device.active} />
          </div>
        )
      })
    }

    return (
      <div className='Overview'>
        <OverviewHeader />
        <div className='Overview__search-bar-container'>
          <div>
            <Search
              className='Overview__search-bar'
              small
              id='device-search'
              labelText='Search'
              placeHolderText='Search Devices'
              onChange={Overview.searchOnChangeHandler}
            />
          </div>
        </div>
        <div className={overviewContentClass}>
          {overviewContent}
        </div>
      </div>
    )
  }
}

export default Overview

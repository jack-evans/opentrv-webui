import React, { Component } from 'react'
import OverviewHeader from '../OverviewHeader/OverviewHeader'
import { Button, Search } from 'carbon-components-react'
import DeviceTile from '../DeviceTile/DeviceTile'

const returnedDevices = [{
  id: '1230',
  name: 'Device 1',
  active: true,
  currentTemperature: 26.2
}, {
  id: '1231',
  name: 'Device 2',
  active: false,
  currentTemperature: 23.5
}, {
  id: '1232',
  name: 'Device 3',
  active: true,
  currentTemperature: 21.9
}, {
  id: '1233',
  name: 'Device 4',
  active: true,
  currentTemperature: 25.2
}, {
  id: '1234',
  name: 'Device 5',
  active: true,
  currentTemperature: 25.2
}, {
  id: '1235',
  name: 'Device 5',
  active: true,
  currentTemperature: 25.2
}, {
  id: '1236',
  name: 'Device 5',
  active: true,
  currentTemperature: 25.2
}, {
  id: '1237',
  name: 'Device 5',
  active: true,
  currentTemperature: 25.2
}, {
  id: '1238',
  name: 'Device 5',
  active: true,
  currentTemperature: 25.2
}, {
  id: '1239',
  name: 'Device 5',
  active: true,
  currentTemperature: 25.2
}, {
  id: '1240',
  name: 'jeff',
  active: true,
  currentTemperature: 25.2
}]

class Overview extends Component {
  constructor (props) {
    super(props)
    let devices = Overview.retrieveDevices()
    this.search = ''
    this.state = {
      devices: devices,
      visibleDevices: devices
    }

    this.discoverDevicesButtonOnClick = this.discoverDevicesButtonOnClickHandler.bind(this)
    this.searchOnChange = this.searchOnChangeHandler.bind(this)
    this.searchDevices = this.filterDevices.bind(this)
  }

  searchOnChangeHandler (event) {
    this.search = event.target.value
    this.setState({visibleDevices: this.state.devices.filter(this.searchDevices)})
  }

  filterDevices (device) {
    const searchTerm = this.search.toLowerCase()

    return (
      (device.name.toLowerCase().indexOf(searchTerm) !== -1) ||
      (device.currentTemperature.toString().indexOf(searchTerm) !== -1)
    )
  }

  discoverDevicesButtonOnClickHandler () {
    this.setState({
      devices: returnedDevices,
      visibleDevices: returnedDevices
    })
  }

  static retrieveDevices () {
    return []
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
              onClick={this.discoverDevicesButtonOnClick}
            >
              Discover my devices
            </Button>
          </div>
        </div>
      )
    } else {
      // This is where the tiles for each device are build up
      overviewContent = this.state.visibleDevices.map(device => {
        return (
          <DeviceTile key={device.id} name={device.name} temp={device.currentTemperature} active={device.active} />
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
              onChange={this.searchOnChange}
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

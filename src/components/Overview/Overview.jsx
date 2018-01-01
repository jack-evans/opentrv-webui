import React, { Component } from 'react'
import OverviewHeader from '../OverviewHeader/OverviewHeader'
import { Button, Search } from 'carbon-components-react'
import DeviceTile from '../DeviceTile/DeviceTile'
import 'isomorphic-fetch'

class Overview extends Component {
  constructor (props) {
    super(props)
    this.state = {
      devices: [],
      visibleDevices: []
    }
    this.search = ''

    this.discoverDevicesButtonOnClick = this.discoverDevicesButtonOnClickHandler.bind(this)
    this.searchOnChange = this.searchOnChangeHandler.bind(this)
    this.searchDevices = this.filterDevices.bind(this)
  }

  componentWillMount () {
    return Overview.retrieveDevices()
      .then(devices => {
        this.setState({
          devices: devices,
          visibleDevices: devices
        })
      })
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

  async discoverDevicesButtonOnClickHandler () {
    let retrievedDevices = await Overview.discoverDevices()
    this.setState({
      devices: retrievedDevices,
      visibleDevices: retrievedDevices
    })
  }

  static retrieveDevices () {
    return Overview.discoverDevices()
  }

  static discoverDevices () {
    return window.fetch('/api/v1/devices', {
      method: 'GET',
      json: true
    }).then(response => response.json())
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
              iconDescription='Find devices that are on your network'
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
          <DeviceTile key={device.id} id={device.id} name={device.name} temp={device.currentTemperature} active={device.active} />
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

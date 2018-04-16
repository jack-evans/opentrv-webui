import React, { Component, Fragment } from 'react'
import { Button, Loading, Search } from 'carbon-components-react'
import DeviceTile from '../DeviceTile/DeviceTile'
import makeRequest from '../../utils/makeRequest'
import { getToken } from '../../utils/auth'

class DeviceOverview extends Component {
  constructor (props) {
    super(props)
    this.state = {
      devices: [],
      visibleDevices: [],
      isLoading: true
    }
    this.search = ''
    this.timer = {}

    this.discoverDevicesButtonOnClick = this.discoverDevicesButtonOnClickHandler.bind(this)
    this.searchOnChange = this.searchOnChangeHandler.bind(this)
    this.searchDevices = this.filterDevices.bind(this)
  }

  componentDidMount () {
    const tick = () => {
      return DeviceOverview.retrieveDevices()
        .then(devices => {
          this.setState({
            devices: devices,
            visibleDevices: devices.filter(this.searchDevices),
            isLoading: false
          })

          this.timer = setTimeout(tick, 1000)
        })
    }
    tick()
  }

  componentWillUnmount () {
    clearTimeout(this.timer)
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
    let retrievedDevices = await DeviceOverview.discoverDevices('yes')
    this.setState({
      devices: retrievedDevices,
      visibleDevices: retrievedDevices
    })
  }

  static retrieveDevices () {
    return DeviceOverview.discoverDevices('no')
  }

  static discoverDevices (userFlag) {
    let apiPath = `/api/v1/devices?user=${userFlag}`
    let options = {
      method: 'GET',
      json: true,
      headers: {
        'x-opentrv-token': getToken()
      }
    }

    return makeRequest(apiPath, options)
  }

  deleteDevice (id) {
    let apiPath = `/api/v1/devices/${id}`
    let options = {
      method: 'DELETE',
      json: true,
      headers: {
        'x-opentrv-token': getToken()
      }
    }

    return makeRequest(apiPath, options)
      .then(() => {
        return DeviceOverview.discoverDevices('no')
      })
      .then(retrievedDevices => {
        this.setState({
          devices: retrievedDevices,
          visibleDevices: retrievedDevices
        })
      })
  }

  render () {
    let deviceOverviewContent
    let deviceOverviewContentClass = 'DeviceOverview__content'

    if (this.state.isLoading) {
      deviceOverviewContentClass += ' DeviceOverview__content-loading'
      deviceOverviewContent = (
        <div>
          <div style={{'display': 'flex', 'justifyContent': 'center'}}>
            <Loading small withOverlay={false} />
          </div>
          <div>
            Loading. Please Wait...
          </div>
        </div>
      )
    } else if (this.state.devices.length < 1) {
      deviceOverviewContentClass += ' DeviceOverview__content-empty'
      deviceOverviewContent = (
        <div>
          <div className='DeviceOverview__content-empty-message'>
            <h3>You currently do not have any devices registered</h3>
          </div>
          <div>
            <Button
              className='DeviceOverview__discover-button'
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
      deviceOverviewContent = this.state.visibleDevices.map(device => {
        return (
          <DeviceTile
            key={device.id}
            id={device.id}
            name={device.name}
            temp={device.currentTemperature}
            active={device.active}
            handleDelete={() => { this.deleteDevice(device.id) }}
          />
        )
      })
    }

    return (
      <div className='DeviceOverview'>
        <div className='DeviceOverview__search-bar-container'>
          <Fragment>
            <Search
              className='DeviceOverview__search-bar'
              small
              id='device-search'
              labelText='Search'
              placeHolderText='Search Devices'
              onChange={this.searchOnChange}
            />
          </Fragment>
        </div>
        <div className={deviceOverviewContentClass}>
          {deviceOverviewContent}
        </div>
      </div>
    )
  }
}

export default DeviceOverview

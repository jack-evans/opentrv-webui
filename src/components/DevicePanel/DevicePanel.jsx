import React, { Component } from 'react'
import { Breadcrumb, BreadcrumbItem, Button, DetailPageHeader, Icon, TextInput, Tile } from 'carbon-components-react'
import axios from 'axios'

class DevicePanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      isDisabled: true,
      statusColor: '',
      statusText: '',
      device: {},
      invalid: {}
    }
    this.deviceId = props.match.params.id
    this.originalDeviceName = ''

    this.saveOnClickEvent = this.handleSaveOnClick.bind(this)
    this.cancelOnClickEvent = this.handleCancelOnClick.bind(this)
    this.deviceNameChangeEvent = this.handleDeviceNameChangeEvent.bind(this)
  }

  componentDidMount () {
    return axios({
      url: `/api/v1/devices/${this.deviceId}`,
      method: 'GET',
      json: true
    }).then(response => {
      let device = response.data
      this.originalDeviceName = device.name
      this.setState({
        isLoading: false,
        device: device,
        statusColor: device.active ? '#5aa700' : '#e71d32',
        statusText: device.active ? 'Active' : 'Idle'
      })
    })
  }

  handleSaveOnClick () {
    let device = this.state.device
    return axios({
      url: `/api/v1/devices/${device.id}`,
      method: 'PUT',
      json: true,
      data: {
        device: device
      }
    }).then(() => {
      this.forceUpdate()
    })
  }

  handleCancelOnClick () {
    let device = this.state.device
    device.name = this.originalDeviceName
    this.setState({device: device})
  }

  handleDeviceNameChangeEvent (event) {
    let device = this.state.device

    let nameToChangeTo = event.target.value

    if (nameToChangeTo.length > 32) {
      this.setState({
        invalid: {
          id: 'device-name',
          reason: 'tooLong',
          message: 'The device name is too long'
        }
      })
    } else if (nameToChangeTo.length <= 32 && (this.state.invalid.id === 'device-name' && this.state.invalid.reason === 'tooLong')) {
      this.setState({invalid: {}})
    }

    return axios({
      url: `/api/v1/devices`,
      method: 'GET',
      json: true
    }).then(response => {
      let devices = response.data

      devices = devices.filter((trv) => trv.id !== device.id)

      for (let i = 0; i < devices.length; i++) {
        if (devices[i].name === nameToChangeTo) {
          this.setState({
            invalid: {
              id: 'device-name',
              reason: 'exists',
              message: 'The device name already exists'
            }
          })
          break
        } else if (this.state.invalid.id === 'device-name' && this.state.invalid.reason === 'exists') {
          this.setState({invalid: {}})
        }
      }

      if (this.originalDeviceName === nameToChangeTo) {
        this.setState({isDisabled: true})
      } else if (this.state.invalid.id) {
        this.setState({isDisabled: true})
      } else {
        this.setState({isDisabled: false})
      }

      device.name = nameToChangeTo
      this.setState({device: device})
    })
  }

  /**
   * render method
   *
   * renders Another display panel component of the UI experience
   * @returns {HTML} - DevicePanel component
   */
  render () {
    if (this.state.isLoading) {
      return null
    } else {
      return (
        <div className='DevicePanel'>
          <div className='DevicePanel__header'>
            <DetailPageHeader
              title={this.state.device.name}
              statusColor={this.state.statusColor}
              statusText={this.state.statusText}>
              <Icon name='devices' />
              <Breadcrumb>
                <BreadcrumbItem href='/'>
                  Device Overview
                </BreadcrumbItem>
              </Breadcrumb>
            </DetailPageHeader>
          </div>
          <div className='DevicePanel__content'>
            <div className='DevicePanel__basic-info'>
              <h3>Basic Information</h3>
              <div className='DevicePanel__basic-info-left'>
                <div className='DevicePanel__name' style={{paddingTop: '10px'}}>
                  <TextInput
                    id='device-name'
                    labelText='Device Name'
                    value={this.state.device.name}
                    onChange={this.deviceNameChangeEvent}
                    invalid={this.state.invalid.id === 'device-name'}
                    invalidText={this.state.invalid.message}
                  />
                </div>
                <div className='DevicePanel__serial-id' style={{paddingTop: '10px'}}>
                  <TextInput
                    disabled
                    id='device-serial-number'
                    labelText='Device Serial Number'
                    defaultValue={this.state.device.serialId}
                  />
                </div>
              </div>
              <div className='DevicePanel__basic-info-right'>
                <div className='DevicePanel__current-temperature' style={{paddingTop: '10px'}}>
                  <Tile>
                    <h3>Current Temperature: {this.state.device.currentTemperature}&#176;C </h3>
                  </Tile>
                </div>
              </div>
            </div>
            <div className='DevicePanel__buttons'>
              <Button
                kind='secondary'
                className='DevicePanel__cancel-button'
                onClick={this.cancelOnClickEvent}
                disabled={this.state.isDisabled}
              >
                Cancel
              </Button>
              <Button
                className='DevicePanel__save-button'
                onClick={this.saveOnClickEvent}
                disabled={this.state.isDisabled}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default DevicePanel

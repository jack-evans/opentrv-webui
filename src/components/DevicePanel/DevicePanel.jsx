import React, { Component } from 'react'
import { Breadcrumb, BreadcrumbItem, Button, DetailPageHeader, Icon, NumberInput, TextInput, Tile } from 'carbon-components-react'

class DevicePanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      isDisabled: true,
      statusColor: '',
      statusText: '',
      device: {},
      invalid: []
    }
    this.deviceId = props.match.params.id
    this.originalDevice = {}

    this.saveOnClickEvent = this.handleSaveOnClick.bind(this)
    this.cancelOnClickEvent = this.handleCancelOnClick.bind(this)
    this.deviceNameChangeEvent = this.handleDeviceNameChangeEvent.bind(this)
    this.targetTempChangeEvent = this.handleTargetTemperatureChange.bind(this)
  }

  componentDidMount () {
    let url = `/api/v1/devices/${this.deviceId}`
    let options = {
      method: 'GET',
      json: true
    }

    return global.fetch(url, options)
      .then(response => response.json())
      .then(device => {
        this.originalDevice = JSON.parse(JSON.stringify(device))
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
    let url = `/api/v1/devices/${device.id}`
    let options = {
      method: 'PUT',
      json: true,
      data: {
        device: device
      }
    }

    return global.fetch(url, options)
      .then(() => {
        this.forceUpdate()
      })
  }

  handleCancelOnClick () {
    let device = this.state.device
    device = JSON.parse(JSON.stringify(this.originalDevice))
    this.setState({device: device})
  }

  handleTargetTemperatureChange (event) {
    // Handle both physical number input and button press at side of input box
    let temperature = event.target.valueAsNumber || event.imaginaryTarget.valueAsNumber
    let errors = this.state.invalid

    if (isNaN(temperature)) {
      errors.push({
        id: 'device-target-temperature',
        reason: 'NaN',
        message: 'The value must be a number'
      })
      this.setState({
        invalid: errors
      })
    } else {
      if (errors.length > 0) {
        errors.forEach((error, index) => {
          if (error.id === 'device-target-temperature') {
            errors = errors.splice(index, 1)
          }
        })
      }

      let device = this.state.device
      device.targetTemperature = temperature
      this.setState({
        device: device
      })
    }
  }

  handleDeviceNameChangeEvent (event) {
    let device = this.state.device

    let nameToChangeTo = event.target.value

    if (nameToChangeTo.length > 32) {
      this.setState((prevState) => ({
        invalid: prevState.invalid.push({
          id: 'device-name',
          reason: 'tooLong',
          message: 'The device name is too long'
        })
      }))
    } else if (nameToChangeTo.length <= 32 && (this.state.invalid.id === 'device-name' && this.state.invalid.reason === 'tooLong')) {
      this.setState({invalid: {}})
    }

    let url = `/api/v1/devices`
    let options = {
      method: 'GET',
      json: true
    }

    return global.fetch(url, options)
      .then(response => response.json())
      .then(devices => {
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

  checkValid (id) {
    let errors = this.state.invalid
    let foundMatchingId = false

    if (errors.length > 0) {
      errors.forEach(error => {
        if (error.id === id) {
          foundMatchingId = true
        }
      })
    }

    return foundMatchingId
  }

  getErrorMessage (id) {
    let errors = this.state.invalid
    let errorMessage = ''

    if (errors.length > 0) {
      errors.forEach(error => {
        if (error.id === id) {
          errorMessage = error.message
        }
      })
    }
    return errorMessage
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
                <div className='DevicePanel__name' style={{paddingTop: '15px'}}>
                  <TextInput
                    id='device-name'
                    labelText='Device Name'
                    value={this.state.device.name}
                    onChange={this.deviceNameChangeEvent}
                    invalid={this.state.invalid.id === 'device-name'}
                    invalidText={this.state.invalid.message}
                  />
                </div>
                <div className='DevicePanel__serial-id' style={{paddingTop: '15px'}}>
                  <TextInput
                    disabled
                    id='device-serial-number'
                    labelText='Device Serial Number'
                    defaultValue={this.state.device.serialId}
                  />
                </div>
                <div className='DevicePanel__target-temp' style={{paddingTop: '15px'}}>
                  <NumberInput
                    id='device-target-temperature'
                    label='Device Target Temperature'
                    min={10}
                    max={35}
                    step={0.2}
                    value={this.state.device.ambientTemperature}
                    onChange={this.targetTempChangeEvent}
                    invalid={this.checkValid('device-target-temperature')}
                    invalidText={this.getErrorMessage('device-target-temperature')}
                  />
                </div>
              </div>
              <div className='DevicePanel__basic-info-right'>
                <div className='DevicePanel__current-temperature' style={{paddingTop: '10px'}}>
                  <Tile>
                    <h3>Current Temperature: </h3>
                    <h3>{this.state.device.currentTemperature}&#176;C</h3>
                  </Tile>
                </div>
                <div className='DevicePanel__ambient-temperature' style={{paddingTop: '10px'}}>
                  <Tile>
                    <h3>Ambient Temperature: </h3>
                    <h3>{this.state.device.ambientTemperature}&#176;C</h3>
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

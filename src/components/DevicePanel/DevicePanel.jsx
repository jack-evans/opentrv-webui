import React, { Component } from 'react'
import { Breadcrumb, BreadcrumbItem, Button, DetailPageHeader, Icon, NumberInput, TextInput, Tile } from 'carbon-components-react'
import NotificationPanel from '../NotificationPanel/NotificationPanel'
import makeRequest from '../../utils/makeRequest'
import { getToken } from '../../utils/auth'

class DevicePanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      isDisabled: true,
      statusColor: '',
      statusText: '',
      device: {},
      invalid: {},
      notifications: []
    }
    this.deviceId = props.match.params.id
    this.originalDevice = {}

    this.saveOnClickEvent = this.handleSaveOnClick.bind(this)
    this.cancelOnClickEvent = this.handleCancelOnClick.bind(this)
    this.deviceNameChangeEvent = this.handleDeviceNameChangeEvent.bind(this)
    this.targetTempChangeEvent = this.handleTargetTemperatureChange.bind(this)
  }

  componentDidMount () {
    let apiPath = `/api/v1/devices/${this.deviceId}`
    let options = {
      method: 'GET',
      json: true,
      headers: {
        'x-opentrv-token': getToken()
      }
    }

    return makeRequest(apiPath, options)
      .then(device => {
        this.originalDevice = JSON.parse(JSON.stringify(device))
        this.setState({
          isLoading: false,
          device: device,
          statusColor: device.active ? '#5aa700' : '#e71d32',
          statusText: device.active ? 'Active' : 'Idle'
        })
      })
      .catch(error => {
        throw error
      })
  }

  handleSaveOnClick () {
    let device = this.state.device
    let apiPath = `/api/v1/devices/${device.id}`

    let options = {
      method: 'PUT',
      json: true,
      body: JSON.stringify(device),
      headers: {
        'content-type': 'application/json',
        'x-opentrv-token': getToken()
      }
    }

    return makeRequest(apiPath, options)
      .then(device => {
        this.originalDevice = device
        let notifications = this.state.notifications
        notifications.push({
          title: 'Successfully Saved',
          subtitle: 'The device was successfully updated',
          timeStamp: new Date(),
          kind: 'success'
        })
        this.setState({notifications: notifications})
      })
      .catch(error => {
        let notifications = this.state.notifications
        notifications.push({
          title: 'Save Failed',
          subtitle: `The device failed to save (${error.status})`,
          timeStamp: new Date(),
          kind: 'error'
        })
        this.setState({notifications: notifications})
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
      errors['device-target-temperature'] = {
        reason: 'NaN',
        message: 'The value must be a number'
      }
      this.setState({invalid: errors})
    } else {
      if (errors['device-target-temperature']) {
        delete errors['device-target-temperature']
        this.setState({invalid: errors})
      }

      let device = this.state.device
      device.targetTemperature = temperature
      this.setState({device: device})
    }

    if (this.originalDevice.targetTemperature === temperature) {
      this.setState({isDisabled: true})
    } else {
      this.setState({isDisabled: false})
    }
  }

  handleDeviceNameChangeEvent (event) {
    let device = this.state.device

    let nameToChangeTo = event.target.value
    let errors = this.state.invalid

    if (nameToChangeTo.length > 32) {
      errors['device-name'] = {
        reason: 'tooLong',
        message: 'The device name is too long'
      }
      this.setState({invalid: errors})
    } else {
      if (errors['device-name'] && errors['device-name'].reason === 'tooLong') {
        delete errors['device-name']
      }
      this.setState({invalid: errors})
    }

    let apiPath = `/api/v1/devices`
    let options = {
      method: 'GET',
      json: true,
      headers: {
        'x-opentrv-token': getToken()
      }
    }

    return makeRequest(apiPath, options)
      .then(devices => {
        devices = devices.filter(trv => trv.id !== device.id)

        for (let i = 0; i < devices.length; i++) {
          if (devices[i].name === nameToChangeTo) {
            errors['device-name'] = {
              reason: 'exists',
              message: 'The device name already exists'
            }
            this.setState({invalid: errors})
            break
          } else {
            if (errors['device-name'] && errors['device-name'].reason === 'exists') {
              delete errors['device-name']
            }
            this.setState({invalid: errors})
          }
        }

        if (this.originalDevice.name === nameToChangeTo) {
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

    if (errors[id]) {
      foundMatchingId = true
    }
    return foundMatchingId
  }

  getErrorMessage (id) {
    let errors = this.state.invalid
    let errorMessage = ''

    if (errors[id]) {
      errorMessage = errors[id].message
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
                <BreadcrumbItem href='/overview'>
                  Device Overview
                </BreadcrumbItem>
              </Breadcrumb>
            </DetailPageHeader>
          </div>
          <div className='DevicePanel__content'>
            <div className='DevicePanel__basic-info'>
              <h3>Basic Information</h3>
              <p>
                The basic information for the TRV device is shown below.
                In this panel you can rename the device as well as set a temperature target for the device to increase to.
              </p>
              <div className='DevicePanel__basic-info-left'>
                <div className='DevicePanel__name' style={{paddingTop: '15px'}}>
                  <TextInput
                    id='device-name'
                    labelText='Name'
                    value={this.state.device.name}
                    onChange={this.deviceNameChangeEvent}
                    invalid={this.checkValid('device-name')}
                    invalidText={this.getErrorMessage('device-name')}
                  />
                </div>
                <div className='DevicePanel__serial-id' style={{paddingTop: '15px'}}>
                  <TextInput
                    disabled
                    id='device-serial-number'
                    labelText='Serial Number'
                    value={this.state.device.serialId}
                  />
                </div>
                <div className='DevicePanel__target-temp' style={{paddingTop: '15px'}}>
                  <NumberInput
                    id='device-target-temperature'
                    label='Target Temperature'
                    min={10}
                    max={35}
                    step={0.2}
                    value={this.state.device.targetTemperature}
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
                    <h3 className='DevicePanel__current-temperature-display'>
                      {this.state.device.currentTemperature}&#176;C
                    </h3>
                  </Tile>
                </div>
                <div className='DevicePanel__ambient-temperature' style={{paddingTop: '10px'}}>
                  <Tile>
                    <h3>Ambient Temperature: </h3>
                    <h3 className='DevicePanel__ambient-temperature-display'>
                      {this.state.device.ambientTemperature}&#176;C
                    </h3>
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
          <NotificationPanel notifications={this.state.notifications} />
        </div>
      )
    }
  }
}

export default DevicePanel

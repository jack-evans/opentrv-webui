import React, { Component } from 'react'
import { Breadcrumb, BreadcrumbItem, Button, DetailPageHeader, Icon, TextInput } from 'carbon-components-react'
import axios from 'axios'

class DevicePanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      statusColor: '',
      statusText: '',
      device: {}
    }
    this.deviceId = props.match.params.id
  }

  componentDidMount () {
    return axios({
      url: `/api/v1/devices/${this.deviceId}`,
      method: 'GET',
      json: 'true'
    }).then(response => {
      let device = response.data
      this.setState({
        isLoading: false,
        device: device,
        statusColor: device.active ? '#5aa700' : '#e71d32',
        statusText: device.active ? 'Active' : 'Idle'
      })
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
              <div className='DevicePanel__name' style={{paddingTop: '10px'}}>
                <TextInput
                  id='device-name'
                  labelText='Device Name'
                  defaultValue={this.state.device.name}
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
            <div className='DevicePanel__buttons'>
              <Button
                kind='secondary'
                className='DevicePanel__cancel-button'
              >
                Cancel
              </Button>
              <Button className='DevicePanel__save-button'>
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

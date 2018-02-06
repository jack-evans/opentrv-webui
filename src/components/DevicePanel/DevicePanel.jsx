import React, { Component } from 'react'
import { Breadcrumb, BreadcrumbItem, DetailPageHeader, Icon } from 'carbon-components-react'
import axios from 'axios'

class DevicePanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      statusColor: '',
      statusText: '',
      deviceName: ''
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
        deviceName: device.name,
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
              title={this.state.deviceName}
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
              hello
            </div>
          </div>
        </div>
      )
    }
  }
}

export default DevicePanel

import React, { Component } from 'react'
import { Breadcrumb, BreadcrumbItem, DetailPageHeader, Icon } from 'carbon-components-react'
import axios from 'axios'

class DevicePanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      statusColor: '#5aa700',
      statusText: 'Active',
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
        deviceName: device.name
      })
      if (!device.active) {
        this.setState({
          statusColor: '#e71d32',
          statusText: 'Idle'
        })
      }
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
        <div>
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
      )
    }
  }
}

export default DevicePanel

import React, { Component } from 'react'
import { Breadcrumb, BreadcrumbItem, DetailPageHeader, Icon } from 'carbon-components-react'

class DevicePanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      statusColor: '#5aa700',
      statusText: 'Active'
    }
    this.deviceId = props.match.params.id
  }

  componentDidMount () {
    return window.fetch(`/api/v1/devices/${this.deviceId}`, {
      method: 'GET',
      json: 'true'
    }).then(device => {
      this.deviceName = device.name
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
    return (
      <div>
        <DetailPageHeader
          title={this.deviceName}
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

export default DevicePanel

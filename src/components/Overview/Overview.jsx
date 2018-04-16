import React, { Component } from 'react'
import OverviewHeader from '../OverviewHeader/OverviewHeader'
import PolicyOverview from '../PolicyOverview/PolicyOverview'
import DeviceOverview from '../DeviceOverview/DeviceOverview'

class Overview extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tabSelected: 0
    }

    this.handleTabChange = this.handleTabChange.bind(this)
  }

  handleTabChange (event) {
    this.setState({tabSelected: event})
  }

  /**
   * render method
   *
   * renders the overview component of the UI experience
   * @returns {HTML} - Overview component
   */
  render () {
    let overviewContent

    if (this.state.tabSelected === 0) {
      overviewContent = (
        <DeviceOverview />
      )
    } else if (this.state.tabSelected === 1) {
      overviewContent = (
        <PolicyOverview />
      )
    }

    return (
      <div className='Overview'>
        <OverviewHeader tabSelected={this.state.tabSelected} handleTabChange={this.handleTabChange} />
        {overviewContent}
      </div>
    )
  }
}

export default Overview

import React, { Component } from 'react'
import OverviewHeader from '../OverviewHeader/OverviewHeader'

class Overview extends Component {
  /**
   * render method
   *
   * renders the overview component of the UI experience
   * @returns {HTML} - Overview component
   */
  render () {
    return (
      <div className='Overview'>
        <OverviewHeader />
      </div>
    )
  }
}

export default Overview

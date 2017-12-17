import React, { Component } from 'react'
import OverviewHeader from '../OverviewHeader/OverviewHeader'
import { Button, Search } from 'carbon-components-react'

class Overview extends Component {
  constructor (props) {
    super(props)
    this.search = ''
    this.state = {
      visibleDevices: Overview.retrieveDevices()
    }
  }

  static retrieveDevices () {
    return []
  }

  /**
   * render method
   *
   * renders the overview component of the UI experience
   * @returns {HTML} - Overview component
   */
  render () {
    let overviewContent

    if (this.state.visibleDevices.length < 1) {
      overviewContent = (
        <Button
          className='Overview__discover-button'
          icon='add--outline'
          iconDescription='Add devices'
          onClick={() => console.log('button clicked')}
        >
          Discover my devices
        </Button>
      )
    } else {
      // This is where the tiles for each device are build up
    }

    return (
      <div className='Overview'>
        <OverviewHeader />
        <div className='Overview__search-bar-container'>
          <Search
            className='Overview__search-bar'
            small
            id='device-search'
            labelText='Search'
            placeHolderText='Search Devices'
          />
        </div>
        <div className='Overview__content'>
          {overviewContent}
        </div>
      </div>
    )
  }
}

export default Overview

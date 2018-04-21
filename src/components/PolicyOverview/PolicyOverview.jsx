import React, { Component, Fragment } from 'react'
import { Loading, Search } from 'carbon-components-react'

class PolicyOverview extends Component {
  constructor (props) {
    super(props)
    this.state = {
      devices: [],
      visibleDevices: [],
      isLoading: true
    }
    this.search = ''

    this.searchOnChange = this.searchOnChangeHandler.bind(this)
    this.searchDevices = this.filterDevices.bind(this)
  }

  searchOnChangeHandler (event) {
    this.search = event.target.value
    this.setState({visibleDevices: this.state.devices.filter(this.searchDevices)})
  }

  filterDevices (device) {
    const searchTerm = this.search.toLowerCase()

    return (
      (device.name.toLowerCase().indexOf(searchTerm) !== -1) ||
      (device.currentTemperature.toString().indexOf(searchTerm) !== -1)
    )
  }

  render () {
    let PolicyOverviewContentClass = 'PolicyOverview__content '
    let PolicyOverviewContent

    if (this.state.isLoading) {
      PolicyOverviewContentClass += ' PolicyOverview__content-loading'
      PolicyOverviewContent = (
        <div>
          <div style={{'display': 'flex', 'justifyContent': 'center'}}>
            <Loading small withOverlay={false} />
          </div>
          <div>
            Loading. Please Wait...
          </div>
        </div>
      )
    } else if (this.state.devices.length < 1) {
      PolicyOverviewContentClass += ' PolicyOverview__content-empty'
      PolicyOverviewContent = (
        <div>
          <div className='PolicyOverview__content-empty-message'>
            <h3>You currently do not have any Policies created</h3>
          </div>
        </div>
      )
    }

    return (
      <div className='PolicyOverview'>
        <div className='PolicyOverview__search-bar-container'>
          <Fragment>
            <Search
              className='PolicyOverview__search-bar'
              small
              id='policy-search'
              labelText='Search'
              placeHolderText='Search Devices'
              onChange={this.searchOnChange}
            />
          </Fragment>
        </div>
        <div className={PolicyOverviewContentClass}>
          {PolicyOverviewContent}
        </div>
      </div>
    )
  }
}

export default PolicyOverview

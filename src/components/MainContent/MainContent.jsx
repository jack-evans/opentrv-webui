import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import Overview from '../Overview/Overview'
import DevicePanel from '../DevicePanel/DevicePanel'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

class MainContent extends Component {
  /**
   * render method
   *
   * renders the Main content component of the UI experience
   * @returns {HTML} - MainContent component
   */
  render () {
    return (
      <ErrorBoundary>
        <Switch className='MainContent'>
          <Route exact path='/' component={Overview} />
          <Route path='/devices/:id' component={DevicePanel} />
        </Switch>
      </ErrorBoundary>
    )
  }
}

export default MainContent

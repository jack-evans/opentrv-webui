import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import Overview from '../Overview/Overview'
import AnotherDisplay from '../AnotherDisplay/AnotherDisplay'
import './MainContent.scss'

class MainContent extends Component {
  /**
   * render method
   *
   * renders the Main content component of the UI experience
   * @returns {HTML} - MainContent component
   */
  render () {
    return (
      <Switch className='MainContent'>
        <Route exact path='/' component={Overview} />
        <Route path='/route2' component={AnotherDisplay} />
      </Switch>
    )
  }
}

export default MainContent

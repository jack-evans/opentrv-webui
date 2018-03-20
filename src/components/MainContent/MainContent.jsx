import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import Overview from '../Overview/Overview'
import DevicePanel from '../DevicePanel/DevicePanel'
import Login from '../Login/Login'
import PrivateRoute from '../PrivateRoute/PrivateRoute'
import Welcome from '../Welcome/Welcome'
import Register from '../Register/Register'

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
        <Route exact path='/' component={Welcome} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <PrivateRoute path='/overview' component={Overview} />
        <PrivateRoute path='/devices/:id' component={DevicePanel} />
      </Switch>
    )
  }
}

export default MainContent

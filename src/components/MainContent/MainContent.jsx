import React, { Component, Fragment } from 'react'
import { Switch, Route } from 'react-router-dom'
import Overview from '../Overview/Overview'
import DevicePanel from '../DevicePanel/DevicePanel'
import Login from '../Login/Login'
import PrivateRoute from '../PrivateRoute/PrivateRoute'
import Welcome from '../Welcome/Welcome'
import Register from '../Register/Register'
import Header from '../Header/Header'
import SideBarMenu from '../SideBarMenu/SideBarMenu'
import NotFound from '../NotFound/NotFound'

class MainContent extends Component {
  /**
   * Constructor
   *
   * Sets up the state and event callbacks before the rendering of the component
   * @param props - properties for the class
   */
  constructor (props) {
    super(props)
    this.state = {
      sideBarMenuOpen: false
    }

    this.sideBarMenuEvent = this.handleViewSideBarMenu.bind(this)
  }

  /**
   * handleViewSideBarMenu method
   *
   * Changes the state of sideBarMenuOpen when the button in the header is clicked
   */
  handleViewSideBarMenu () {
    this.setState({
      sideBarMenuOpen: !this.state.sideBarMenuOpen
    })
  }

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
        <Route render={(props) => {
          if (props.location.pathname === '/overview') {
            return (
              <Fragment>
                <Header onClick={this.sideBarMenuEvent} isOpen={this.state.sideBarMenuOpen} />
                <SideBarMenu isOpen={this.state.sideBarMenuOpen} />
                <PrivateRoute path='/overview' component={Overview} />
              </Fragment>
            )
          } else if (props.location.pathname.startsWith('/devices/')) {
            return (
              <Fragment>
                <Header onClick={this.sideBarMenuEvent} isOpen={this.state.sideBarMenuOpen} />
                <SideBarMenu isOpen={this.state.sideBarMenuOpen} />
                <PrivateRoute path='/devices/:id' component={DevicePanel} />
              </Fragment>
            )
          } else {
            return <Route component={NotFound} />
          }
        }} />
      </Switch>
    )
  }
}

export default MainContent

import React, { Component } from 'react'
import Header from './components/Header/Header'
import './App.scss'
import SideBarMenu from './components/SideBarMenu/SideBarMenu'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sideBarMenuOpen: false
    }
  }

  handleViewSideBarMenu () {
    this.setState({
      sideBarMenuOpen: !this.state.sideBarMenuOpen
    })
  }

  /**
   * render method
   *
   * Creates the html for the main component of the application
   * @returns {HTML} - the main component
   */
  render () {
    return (
      <div className='App'>
        <Header onClick={this.handleViewSideBarMenu.bind(this)} />
        <SideBarMenu isOpen={this.state.sideBarMenuOpen} />
        <p className='App__intro'>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    )
  }
}

export default App

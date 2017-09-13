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
   * Creates the html for the App Component Class
   * @returns {HTML} - App Component
   */
  render () {
    return (
      <div className='App'>
        <Header onClick={this.handleViewSideBarMenu.bind(this)} isOpen={this.state.sideBarMenuOpen} />
        <SideBarMenu isOpen={this.state.sideBarMenuOpen} />
        <p className='App__intro'>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    )
  }
}

export default App

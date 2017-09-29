import React, { Component } from 'react'
import Header from './components/Header/Header'
import './App.scss'
import SideBarMenu from './components/SideBarMenu/SideBarMenu'
import MainContent from './components/MainContent/MainContent'

class App extends Component {

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
   * Creates the html for the App Component Class
   * @returns {HTML} - App Component
   */
  render () {
    return (
      <div className='App'>
        <Header onClick={this.sideBarMenuEvent} isOpen={this.state.sideBarMenuOpen} />
        <SideBarMenu isOpen={this.state.sideBarMenuOpen} />
        <MainContent />
      </div>
    )
  }
}

export default App

import React, { Component } from 'react'
import Header from './components/Header/Header'
import './App.scss'
import SideBarMenu from './components/SideBarMenu/SideBarMenu'
import MainContent from './components/MainContent/MainContent'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sideBarMenuOpen: false
    }

    this.sideBarMenuClickEvent = this.handleSideBarMenuClick.bind(this)
  }

  handleSideBarMenuClick () {
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
        <Header onClick={this.sideBarMenuClickEvent} isOpen={this.state.sideBarMenuOpen} />
        <SideBarMenu isOpen={this.state.sideBarMenuOpen} />
        <MainContent />
      </div>
    )
  }
}

export default App

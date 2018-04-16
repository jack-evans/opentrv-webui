import React, { Component, Fragment } from 'react'
import MainContent from './components/MainContent/MainContent'

class App extends Component {
  /**
   * render method
   *
   * Creates the html for the App Component Class
   * @returns {HTML} - App Component
   */
  render () {
    return (
      <Fragment className='App'>
        <MainContent />
      </Fragment>
    )
  }
}

export default App

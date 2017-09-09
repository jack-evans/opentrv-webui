import React, { Component } from 'react'
import Header from './components/Header/Header'
import './App.scss'

class App extends Component {

  /**
   * render method
   *
   * Creates the html for the main component of the application
   * @returns {HTML} - the main component
   */
  render () {
    return (
      <div className='App'>
        <Header />
        <p className='App__intro'>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    )
  }
}

export default App

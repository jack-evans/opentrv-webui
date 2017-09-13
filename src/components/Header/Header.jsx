import React, { Component } from 'react'
import './Header.scss'

class Header extends Component {
  render () {
    return (
      <header className='Header'>
        <div className='Header__left-container'>
          <div className='Header__left-nav-toggle-container'>
            <button type='button' className='Header__left-nav-toggle' onClick={this.props.onClick}>
              <span />
            </button>
          </div>
          <a className='Header__title' href='/'>Welcome to React</a>
        </div>
      </header>
    )
  }
}

export default Header

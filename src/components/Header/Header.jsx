import React, { Component } from 'react'
import './Header.scss'

class Header extends Component {
  render () {
    const buttonClassName = this.props.isOpen ? 'Header__left-nav-toggle Header__left-nav-toggle--active' : 'Header__left-nav-toggle'
    return (
      <header className='Header'>
        <div className='Header__left-nav-toggle-container'>
          <button type='button' className={buttonClassName} onClick={this.props.onClick}>
            <span className='Header__left-nav-icon' />
          </button>
        </div>
        <a className='Header__title' href='/'>
          <h3>Welcome to React</h3>
        </a>
      </header>
    )
  }
}

export default Header

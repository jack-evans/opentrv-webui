import React, { Component } from 'react'
import { Icon } from 'carbon-components-react'
import './Header.scss'

class Header extends Component {
  render () {
    return (
      <header className='Header'>
        <div className='Header__left-container'>
          <div className='Header__menu'>
            <button type='button' className='Header__menu-button' onClick={this.props.onClick}>
              <Icon className='Header__menu-icon' name='icon--menu' />
            </button>
          </div>
          {/* <a className='Header__title' href='/'>Welcome to React</a> */}
        </div>
      </header>
    )
  }
}

export default Header

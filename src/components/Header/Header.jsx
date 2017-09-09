import React, { Component } from 'react'
import { Icon } from 'carbon-components-react'
import './Header.scss'

class Header extends Component {

  constructor (props) {
    super(props)
    this.state = { isExpanded: false}
  }

  handleMenuClickEvent () {
    this.setState({
      isExpanded: !this.state.isExpanded
    })
  }

  render () {
    let menu

    if (this.state.isExpanded) {
      menu = (
        <div className='Header__left-nav'>
          I'm a menu
        </div>
      )
    }

    return (
      <div className='Header'>
        <div className='Header__top-nav'>
          <div className='Header__left-container'>
            <div className="Header__menu">
              <button type='button' className='Header__menu-button' onClick={() => this.handleMenuClickEvent()}>
                <Icon className='Header__menu-icon' name='icon--menu' />
              </button>
            </div>
            {/*<a className='Header__title' href='/'>Welcome to React</a>*/}
          </div>
        </div>
        {menu}
      </div>
    )
  }
}

export default Header

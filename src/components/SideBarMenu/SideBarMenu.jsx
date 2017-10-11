import React, { Component } from 'react'
import SideBarMenuItem from '../SideBarMenuItem/SideBarMenuItem'
import './SideBarMenu.scss'

// Content to be populated in the side bar menu
const sideBarMenuContent = [
  {
    href: 'https://facebook.github.io/react/',
    text: 'About React'
  },
  {
    href: 'https://httpbin.org',
    text: 'httpbin.org'
  }
]

class SideBarMenu extends Component {
  /**
   * render method
   *
   * renders the side bar menu component of the UI experience
   * @returns {HTML} - SideBarMenu component
   */
  render () {
    const sideBarMenuClassName = this.props.isOpen ? 'SideBarMenu SideBarMenu__open' : 'SideBarMenu'
    const sideBarMenuItems = sideBarMenuContent.map((sideBarMenuItem, index) => {
      return (<SideBarMenuItem key={index} href={sideBarMenuItem.href} text={sideBarMenuItem.text} />)
    })

    return (
      <div className={sideBarMenuClassName}>
        {sideBarMenuItems}
      </div>
    )
  }
}

export default SideBarMenu

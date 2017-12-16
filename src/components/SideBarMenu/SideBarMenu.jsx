import React, { Component } from 'react'
import SideBarMenuItem from '../SideBarMenuItem/SideBarMenuItem'
import './SideBarMenu.scss'

// Content to be populated in the side bar menu
const sideBarMenuContent = [
  {
    href: 'http://opentrv.org.uk/what-is-opentrv/',
    text: 'About OpenTRV'
  },
  {
    href: 'http://opentrv.org.uk/principles/',
    text: 'OpenTRV principles'
  },
  {
    href: 'https://twitter.com/OpenTRV',
    text: 'OpenTRV Twitter'
  },
  {
    href: 'http://opentrv.org.uk/documents/',
    text: 'TRV documentation'
  },
  {
    href: 'https://github.com/jack-evans/opentrv-webui/issues',
    text: 'Report an Issue'
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

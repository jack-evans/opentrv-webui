import React from 'react'
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

function SideBarMenu ({ isOpen }) {
  const sideBarMenuClassName = isOpen ? 'SideBarMenu SideBarMenu__open' : 'SideBarMenu'
  const sideBarMenuItems = sideBarMenuContent.map((sideBarMenuItem, index) => {
    return (<SideBarMenuItem key={index} href={sideBarMenuItem.href} text={sideBarMenuItem.text} />)
  })

  return (
    <div className={sideBarMenuClassName}>
      {sideBarMenuItems}
    </div>
  )
}

export default SideBarMenu

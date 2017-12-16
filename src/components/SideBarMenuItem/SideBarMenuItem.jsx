import React from 'react'
import './SideBarMenuItem.scss'

/**
 * SideBarMenuItem
 *
 * renders a side bar menu item component with the properties that were passed to the instantiation of the component
 * @param {String} href - the url to redirect to when clicked on
 * @param {String} text - the text to display in the anchor
 * @returns {HTML} - the SideBarMenuItem component
 * @constructor
 */
function SideBarMenuItem ({ href, text }) {
  return (
    <a className='SideBarMenuItem' href={href} target='_blank' rel='noopener'>
      <span className='SideBarMenuItem__content'>
        <h3>{text}</h3>
      </span>
    </a>
  )
}

export default SideBarMenuItem

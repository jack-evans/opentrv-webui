import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './SideBarMenuItem.scss'

class SideBarMenuItem extends Component {
  /**
   * render method
   *
   * renders a side bar menu item component with the properties that were passed to the instantiation of the component
   * @returns {HTML} - the SideBarMenuItem component
   */
  render () {
    return (
      <a className='SideBarMenuItem' href={this.props.href} target='_blank' rel='noopener'>
        <span className='SideBarMenuItem__content'>
          <h3>{this.props.text}</h3>
        </span>
      </a>
    )
  }
}

SideBarMenuItem.propTypes = {
  href: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
}

export default SideBarMenuItem

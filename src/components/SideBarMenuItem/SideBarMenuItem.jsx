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
      <div className='SideBarMenuItem'>
        <a className='SideBarMenuItem__content' href={this.props.href} target='_blank' rel='noopener'>
          <h3>{this.props.text}</h3>
        </a>
      </div>
    )
  }
}

SideBarMenuItem.propTypes = {
  href: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
}

export default SideBarMenuItem

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './SideBarMenuItem.scss'

class SideBarMenuItem extends Component {
  render () {
    return (
      <div className='SideBarMenuItem'>
        <a className='SideBarMenuItem__content' href={this.props.href} target='_blank'>
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

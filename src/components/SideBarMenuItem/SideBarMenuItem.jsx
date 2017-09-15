import React, { Component } from 'react'
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

export default SideBarMenuItem

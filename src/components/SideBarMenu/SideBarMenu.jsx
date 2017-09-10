import React, { Component } from 'react'
import './SideBarMenu.scss'

class SideBarMenu extends Component {

  render () {
    const sideBarMenuClass = this.props.isOpen ? 'SideBarMenu SideBarMenu__open' : 'SideBarMenu'
    return (
      <div className={sideBarMenuClass}>
        <div>I slide into view</div>
        <div>Me too!</div>
        <div>Meee Threeeee!</div>
      </div>
    )
  }
}

export default SideBarMenu
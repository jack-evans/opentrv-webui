import React, { Component } from 'react'

class AnotherDisplay extends Component {
  constructor (props) {
    super(props)
    this.deviceId = props.match.params.id
  }

  /**
   * render method
   *
   * renders Another display panel component of the UI experience
   * @returns {HTML} - AnotherDisplay component
   */
  render () {
    return (
      <div>
        <p>
          I'm another display panel for display: {this.deviceId}
        </p>
      </div>
    )
  }
}

export default AnotherDisplay

import React, { Component } from 'react'

class Welcome extends Component {
  render () {
    return (
      <div>
        <img src={require('./opentrv.jpg')} alt='OpenTRV logo' />
      </div>
    )
  }
}

export default Welcome

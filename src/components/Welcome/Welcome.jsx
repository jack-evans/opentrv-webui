import React, { Component } from 'react'
import { Button } from 'carbon-components-react'

class Welcome extends Component {
  render () {
    return (
      <div className='Welcome'>
        <img src={require('./opentrv.jpg')} alt='OpenTRV logo' />
        <div className='Welcome__buttons'>
          <Button
            kind='secondary'
            className='Welcome__register-button'
            onClick={() => (console.log('registered'))}
          >
            Register
          </Button>
          <Button
            className='Welcome__login-button'
            onClick={() => (console.log('logged in'))}
          >
            Login
          </Button>
        </div>
      </div>
    )
  }
}

export default Welcome

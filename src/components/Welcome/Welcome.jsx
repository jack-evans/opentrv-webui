import React, { Component } from 'react'
import { Button } from 'carbon-components-react'

class Welcome extends Component {
  render () {
    return (
      <div className='Welcome'>
        <img src={require('./opentrv.jpg')} alt='OpenTRV logo' />
        <h2>Welcome to OpenTRV</h2>
        <h3>New User? Click Register to create an account</h3>
        <h3>Existing User? Login to view your TRV system</h3>
        <div className='Welcome__buttons'>
          <Button
            kind='secondary'
            className='Welcome__register-button'
            onClick={() => window.location.assign('/register')}
          >
            Register
          </Button>
          <Button
            className='Welcome__login-button'
            onClick={() => window.location.assign('/login')}
          >
            Login
          </Button>
        </div>
      </div>
    )
  }
}

export default Welcome

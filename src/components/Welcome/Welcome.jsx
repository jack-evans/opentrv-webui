import React, { Component } from 'react'
import { Button } from 'carbon-components-react'

class Welcome extends Component {
  render () {
    return (
      <div className='Welcome'>
        <div>
          <img style={{paddingBottom: '50px'}} src={require('./opentrv.jpg')} alt='OpenTRV logo' />
          <h2 style={{paddingTop: '10px', paddingBottom: '10px'}}>Welcome to OpenTRV</h2>
          <h3 style={{paddingBottom: '10px'}}>New User? Click Register to create an account</h3>
          <h3 style={{paddingBottom: '10px'}}>Existing User? Login to view your TRV system</h3>
          <div className='Welcome__buttons'>
            <Button
              style={{width: '120px'}}
              kind='secondary'
              className='Welcome__register-button'
              onClick={() => window.location.assign('/register')}
            >
              Register
            </Button>
            <Button
              style={{width: '120px'}}
              className='Welcome__login-button'
              onClick={() => window.location.assign('/login')}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default Welcome

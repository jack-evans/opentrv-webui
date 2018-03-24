import React from 'react'
import { Button } from 'carbon-components-react'

const Welcome = () => (
  <div className='Welcome'>
    <div>
      <img style={{paddingBottom: '100px', paddingTop: '100px'}} src={require('../../images/opentrv.jpg')} alt='OpenTRV logo' />
      <h2 style={{paddingTop: '10px', paddingBottom: '10px'}}>Welcome to OpenTRV</h2>
      <p style={{paddingBottom: '10px'}}>New User? Click Register to create an account</p>
      <p style={{paddingBottom: '10px'}}>Existing User? Login to view your TRV system</p>
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

export default Welcome

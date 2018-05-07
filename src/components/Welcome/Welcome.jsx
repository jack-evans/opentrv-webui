import React from 'react'
import { Button } from 'carbon-components-react'

const Welcome = () => (
  <div className='Welcome'>
    <div>
      <img className='Welcome__logo' src={require('../../images/opentrv.jpg')} alt='OpenTRV logo' />
      <h2 className='Welcome__title'>Welcome to OpenTRV</h2>
      <p className='Welcome__content'>New User? Click Register to create an account</p>
      <p className='Welcome__content'>Existing User? Login to view your TRV system</p>
      <div className='Welcome__buttons'>
        <Button
          kind='secondary'
          className='Welcome__register-button Welcome__button'
          onClick={() => window.location.assign('/register')}
        >
          Register
        </Button>
        <Button
          className='Welcome__login-button Welcome__button'
          onClick={() => window.location.assign('/login')}
        >
          Login
        </Button>
      </div>
    </div>
  </div>
)

export default Welcome

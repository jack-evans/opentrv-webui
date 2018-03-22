import React, { Component } from 'react'
import { Button, TextInput } from 'carbon-components-react'

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  render () {
    return (
      <div className='Login'>
        <div className='Login_title'>
          <h1>Login to OpenTRV</h1>
        </div>
        <div className='Login__input'>
          <TextInput
            className='Login__email-input'
            id='login-email'
            labelText='Email'
            placeholder='Enter email address'
          />
          <TextInput
            className='Login__password-input'
            id='login-password'
            labelText='Password'
            placeholder='Enter password'
            type='password'
          />
        </div>
        <div className='Login__buttons'>
          <Button
            kind='secondary'
            className='Login__back-button'
            href='/'
          >
            Back
          </Button>
          <Button
            className='Login__login-button'
          >
            Login
          </Button>
        </div>
      </div>
    )
  }
}

export default Login

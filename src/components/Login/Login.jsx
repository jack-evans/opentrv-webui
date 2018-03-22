import React, { Component } from 'react'
import { Button, Modal, TextInput } from 'carbon-components-react'
import { isAuthenticated, loginUser } from '../../utils/auth'

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      invalid: {},
      failedLogin: false
    }
    this.errorContent = (<div />)

    this.handleLoginOnClick = this.handleLoginOnClick.bind(this)
  }

  handleLoginOnClick () {
    let user = {
      email: this.state.email,
      pass: this.state.password
    }
    if (loginUser(user)) {
      window.location.assign('/overview')
    } else {
      this.setState({failedLogin: true})
    }
  }

  render () {
    if (isAuthenticated()) {
      window.location.assign('/overview')
      return null
    } else if (this.state.failedLogin) {
      this.errorContent = (
        <Modal
          open
          passiveModal
          modalHeading='Login Failed'
        >
          <p>Failed to Login to OpenTRV. </p>
          <p>Please check your email and password was entered correctly.</p>
          <p>If problem persists please contact support</p>
        </Modal>
      )
    }

    return (
      <div className='Login'>
        <div className='Login__content'>
          <div className='Login__title'>
            <h1>Login to OpenTRV</h1>
          </div>
          <div className='Login__input'>
            <div className='Login__email-input'>
              <TextInput
                id='login-email'
                labelText='Email'
                placeholder='Enter email address'
              />
            </div>
            <div className='Login__password-input'>
              <TextInput
                id='login-password'
                labelText='Password'
                placeholder='Enter password'
                type='password'
              />
            </div>
          </div>
          <div className='Login__buttons'>
            <Button
              style={{width: '120px'}}
              kind='secondary'
              className='Login__back-button'
              href='/'
            >
              Back
            </Button>
            <Button
              style={{width: '120px'}}
              className='Login__login-button'
              onClick={this.handleLoginOnClick}
            >
              Login
            </Button>
          </div>
          {this.errorContent}
        </div>
      </div>
    )
  }
}

export default Login

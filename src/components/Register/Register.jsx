import React, { Component } from 'react'
import { Button, Form, FormGroup, FormItem, Modal, TextInput } from 'carbon-components-react'
import makeRequest from '../../utils/makeRequest'

const styles = {
  inputs: {
    marginRight: 'unset'
  }
}

class Register extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: {
        name: '',
        email: '',
        password: '',
        address: {
          firstLine: '',
          secondLine: '',
          city: '',
          county: '',
          country: '',
          postcode: ''
        }
      },
      invalid: {
        'register-password': {
          reason: 'specNotMet',
          message: 'Your password must be at least 8 characters as well as contain at least one uppercase, one lowercase and one number'
        }
      },
      isDisabled: true,
      failedRegister: false
    }
    this.confirmPass = ''

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleModalOnClick = this.handleModalOnClick.bind(this)
    this.checkMatch = this.checkMatch.bind(this)
  }

  handleInputChange (event) {
    const target = event.target
    const inputfield = target.name
    const value = target.value
    const user = this.state.user
    let errors = this.state.invalid

    if (inputfield.includes('->')) {
      const nestedInput = inputfield.split('->')
      let address = nestedInput[0]
      let addressProp = nestedInput[1]
      user[address][addressProp] = value
    } else if (inputfield === 'password-confirm') {
      this.confirmPass = value
    } else {
      user[inputfield] = value
    }

    let regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{7,}$')
    const result = regex.test(user.password)
    if (inputfield === 'password' && result) {
      delete errors['register-password']
    } else if (!result) {
      errors['register-password'] = {
        reason: 'specNotMet',
        message: 'Your password must be at least 8 characters as well as contain at least one uppercase, one lowercase and one number'
      }
    }

    if (
      user.name &&
      user.email &&
      user.address.firstLine &&
      user.address.county &&
      user.address.postcode &&
      user.password &&
      this.confirmPass &&
      Object.getOwnPropertyNames(errors).length < 1
    ) {
      this.setState({user: user, isDisabled: false, invalid: errors})
    } else {
      this.setState({user: user, invalid: errors})
    }
  }

  handleSubmit (event) {
    event.preventDefault()

    let url = '/api/v1/user'
    let options = {
      method: 'POST',
      json: true,
      body: JSON.stringify(this.state.user),
      headers: {
        'content-type': 'application/json'
      }
    }
    return makeRequest(url, options)
      .then(() => {
        window.location.assign('/login')
      })
      .catch(() => {
        this.setState({failedRegister: true})
      })
  }

  handleModalOnClick () {
    this.setState({failedRegister: false})
  }

  checkMatch () {
    let errors = this.state.invalid
    if (this.confirmPass !== this.state.user.password) {
      errors['register-password-confirm'] = {
        reason: 'noMatch',
        message: 'The passwords you have entered do not match'
      }
    } else {
      delete errors['register-password-confirm']
    }
    this.setState({invalid: errors})
  }

  checkValid (id) {
    let errors = this.state.invalid
    let foundMatchingId = false

    if (errors[id]) {
      foundMatchingId = true
    }
    return foundMatchingId
  }

  getErrorMessage (id) {
    let errors = this.state.invalid
    let errorMessage = ''

    if (errors[id]) {
      errorMessage = errors[id].message
    }
    return errorMessage
  }

  render () {
    return (
      <div className='Register'>
        <h2 className='Register__title'>Register for an account</h2>
        <Form className='Register__form' onSubmit={this.handleSubmit}>
          <FormGroup legendText=''>
            <FormItem style={styles.inputs}>
              <TextInput
                id='register-name'
                labelText='*Name'
                name='name'
                required
                placeholder='Name e.g. John Doe'
                value={this.state.user.name}
                onChange={this.handleInputChange}
                invalid={this.checkValid('register-name')}
                invalidText={this.getErrorMessage('register-name')}
              />
            </FormItem>
            <FormItem>
              <TextInput
                id='register-email'
                labelText='*Email'
                name='email'
                required
                placeholder='Email address'
                value={this.state.user.email}
                onChange={this.handleInputChange}
                invalid={this.checkValid('register-email')}
                invalidText={this.getErrorMessage('register-email')}
              />
            </FormItem>
          </FormGroup>
          <FormGroup className='Register__form-address' legendText='Address'>
            <FormItem style={styles.inputs}>
              <TextInput
                id='register-address-firstline'
                labelText='*Line 1'
                name='address->firstLine'
                required
                placeholder='First line'
                value={this.state.user.address.firstLine}
                style={{marginRight: 'unset'}}
                onChange={this.handleInputChange}
                invalid={this.checkValid('register-address-firstline')}
                invalidText={this.getErrorMessage('register-address-firstline')}
              />
            </FormItem>
            <FormItem style={styles.inputs}>
              <TextInput
                id='register-address-secondline'
                labelText='Line 2'
                name='address->secondLine'
                placeholder='Second line'
                value={this.state.user.address.secondLine}
                onChange={this.handleInputChange}
              />
            </FormItem>
            <div style={{display: 'flex'}}>
              <FormItem>
                <TextInput
                  id='register-address-city'
                  labelText='City'
                  name='address->city'
                  placeholder='City'
                  value={this.state.user.address.city}
                  onChange={this.handleInputChange}
                />
              </FormItem>
              <FormItem>
                <TextInput
                  id='register-address-county'
                  labelText='*County'
                  name='address->county'
                  required
                  placeholder='County'
                  value={this.state.user.address.county}
                  onChange={this.handleInputChange}
                  invalid={this.checkValid('register-address-county')}
                  invalidText={this.getErrorMessage('register-address-county')}
                />
              </FormItem>
            </div>
            <div style={{display: 'flex'}}>
              <FormItem>
                <TextInput
                  id='register-address-country'
                  labelText='Country'
                  name='address->country'
                  placeholder='Country'
                  value={this.state.user.address.country}
                  onChange={this.handleInputChange}
                />
              </FormItem>
              <FormItem>
                <TextInput
                  id='register-address-postcode'
                  labelText='*Postcode'
                  name='address->postcode'
                  required
                  placeholder='Postcode'
                  value={this.state.user.address.postcode}
                  onChange={this.handleInputChange}
                  invalid={this.checkValid('register-address-postcode')}
                  invalidText={this.getErrorMessage('register-address-postcode')}
                />
              </FormItem>
            </div>
          </FormGroup>
          <FormGroup legendText=''>
            <FormItem style={styles.inputs}>
              <TextInput
                id='register-password'
                labelText='*Password'
                name='password'
                required
                type='password'
                placeholder='Enter password'
                value={this.state.user.password}
                onChange={this.handleInputChange}
                invalid={this.checkValid('register-password')}
                invalidText={this.getErrorMessage('register-password')}
              />
            </FormItem>
            <FormItem>
              <TextInput
                id='register-password-confirm'
                labelText='*Confirm Password'
                name='password-confirm'
                required
                type='password'
                placeholder='Enter password'
                onChange={this.handleInputChange}
                onBlur={this.checkMatch}
                invalid={this.checkValid('register-password-confirm')}
                invalidText={this.getErrorMessage('register-password-confirm')}
              />
            </FormItem>
          </FormGroup>
          <FormGroup className='Register__form-buttons' legendText=''>
            <Button
              style={{width: '120px'}}
              kind='secondary'
              className='Register__back-button'
              href='/'
            >
              Back
            </Button>
            <Button
              type='submit'
              style={{width: '120px'}}
              className='Register__register-button'
              disabled={this.state.isDisabled}
            >
              Register
            </Button>
          </FormGroup>
        </Form>
        <Modal
          className='Register__failed-modal'
          open={this.state.failedRegister}
          passiveModal
          modalHeading='Register Failed'
          onRequestClose={this.handleModalOnClick}
        >
          <p>Failed to register on OpenTRV.</p>
          <p>Please try again.</p>
          <p>If problem persists please contact support</p>
        </Modal>
      </div>
    )
  }
}

export default Register

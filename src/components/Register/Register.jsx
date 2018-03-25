import React, { Component } from 'react'
import { Button, Form, FormGroup, FormItem, TextInput } from 'carbon-components-react'

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
      invalid: {},
      isDisabled: true,
      failedRegister: false
    }

    this.firstName = ''
    this.lastName = ''
    this.confirmPass = ''

    this.requiredFields = [
      'register-first-name',
      'register-last-name',
      'register-email',
      'register-address-firstline',
      'register-address-county',
      'register-address-postcode',
      'register-password',
      'register-password-confirm'
    ]

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange (event) {
    const target = event.target
    const id = target.id
    const value = target.value

    const user = this.state.user

    switch (id) {
      case 'register-first-name': {
        this.firstName = value
        break
      }

      case 'register-last-name': {
        this.lastName = value
        break
      }

      case 'register-email': {
        user.email = value
        break
      }

      case 'register-address-firstline': {
        user.address.firstLine = value
        break
      }

      case 'register-address-secondline': {
        user.address.secondLine = value
        break
      }

      case 'register-address-city': {
        user.address.city = value
        break
      }

      case 'register-address-county': {
        user.address.county = value
        break
      }

      case 'register-address-country': {
        user.address.country = value
        break
      }

      case 'register-address-postcode': {
        user.address.postcode = value
        break
      }

      case 'register-password': {
        user.password = value
        break
      }

      case 'register-password-confirm': {
        this.confirmPass = value
        break
      }
    }

    user.name = `${this.firstName} ${this.lastName}`

    if (
      user.name &&
      (this.firstName && this.lastName) &&
      user.address.firstLine &&
      user.address.county &&
      user.address.postcode &&
      user.password &&
      this.confirmPass
    ) {
      this.setState({user: user, isDisabled: false})
    } else {
      this.setState({user: user})
    }
  }

  handleSubmit (event) {
    event.preventDefault()
    // do validation and make request
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
          <FormGroup className='Register__form-name' legendText='Name'>
            <FormItem>
              <TextInput
                id='register-first-name'
                labelText='*First'
                placeholder='First name'
                value={this.state.user.name.split(' ')[0]}
                onChange={this.handleInputChange}
                invalid={this.checkValid('register-first-name')}
                invalidText={this.getErrorMessage('register-first-name')}
              />
            </FormItem>
            <FormItem>
              <TextInput
                id='register-last-name'
                labelText='*Last'
                placeholder='Last name'
                value={this.state.user.name.split(' ')[0]}
                onChange={this.handleInputChange}
                invalid={this.checkValid('register-last-name')}
                invalidText={this.getErrorMessage('register-last-name')}
              />
            </FormItem>
          </FormGroup>
          <FormGroup legendText=''>
            <FormItem>
              <TextInput
                id='register-email'
                labelText='*Email'
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
                  placeholder='City'
                  value={this.state.user.address.city}
                  onChange={this.handleInputChange}
                />
              </FormItem>
              <FormItem>
                <TextInput
                  id='register-address-county'
                  labelText='*County'
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
                  placeholder='Country'
                  value={this.state.user.address.country}
                  onChange={this.handleInputChange}
                />
              </FormItem>
              <FormItem>
                <TextInput
                  id='register-address-postcode'
                  labelText='*Postcode'
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
                type='password'
                placeholder='Enter password'
                onChange={this.handleInputChange}
                invalid={this.checkValid('register-confirm-password')}
                invalidText={this.getErrorMessage('register-confirm-password')}
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
      </div>
    )
  }
}

export default Register

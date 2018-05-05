import React, { Component, Fragment } from 'react'
import { Button, FormGroup, FormItem, FormLabel, Modal, ProgressIndicator, ProgressStep, TextInput, Tooltip } from 'carbon-components-react'
import makeRequest from '../../utils/makeRequest'

class Register extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentIndex: 0,
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
        },
        gateway: {
          url: '',
          username: '',
          password: ''
        }
      },
      invalid: {
        'register-password': {
          reason: 'specNotMet',
          message: 'Your password does not meet the criteria, click on the i for more info'
        }
      },
      modalContent: {
        heading: '',
        message: []
      },
      modalOpen: false
    }
    this.confirmPass = ''

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleModalOnClick = this.handleModalOnClick.bind(this)
    this.checkMatch = this.checkMatch.bind(this)
    this.incrementCurrentIndex = this.incrementCurrentIndex.bind(this)
    this.decrementCurrentIndex = this.decrementCurrentIndex.bind(this)
  }

  incrementCurrentIndex () {
    const currentUser = this.state.user
    const errors = this.state.invalid

    switch (this.state.currentIndex) {
      case 0: {
        if (!currentUser.name) {
          errors['register-name'] = {
            reason: 'required',
            message: 'This field is required'
          }
        } else {
          delete errors['register-name']
        }

        if (!currentUser.email) {
          errors['register-email'] = {
            reason: 'required',
            message: 'This field is required'
          }
        } else {
          delete errors['register-email']
        }

        if (errors['register-name'] || errors['register-email']) {
          this.setState({invalid: errors})
          return
        }
        break
      }

      case 1: {
        if (!currentUser.address.firstLine) {
          errors['register-address-firstline'] = {
            reason: 'required',
            message: 'This field is required'
          }
        } else {
          delete errors['register-address-firstline']
        }

        if (!currentUser.address.county) {
          errors['register-address-county'] = {
            reason: 'required',
            message: 'This field is required'
          }
        } else {
          delete errors['register-address-county']
        }

        if (!currentUser.address.postcode) {
          errors['register-address-postcode'] = {
            reason: 'required',
            message: 'This field is required'
          }
        } else {
          delete errors['register-address-postcode']
        }

        if (
          errors['register-address-firstline'] ||
          errors['register-address-county'] ||
          errors['register-address-postcode']
        ) {
          this.setState({invalid: errors})
          return
        }
        break
      }

      case 2: {
        if (!currentUser.password) {
          errors['register-password'] = {
            reason: 'required',
            message: 'This field is required'
          }
        } else {
          delete errors['register-password']
        }

        if (!this.confirmPass) {
          errors['register-password-confirm'] = {
            reason: 'required',
            message: 'This field is required'
          }
        } else {
          delete errors['register-password-confirm']
        }

        if (currentUser.password !== this.confirmPass) {
          errors['register-password-confirm'] = {
            reason: 'noMatch',
            message: 'These passwords do not match'
          }

          errors['register-password'] = {
            reason: 'noMatch',
            message: 'These passwords do not match'
          }
        }

        if (errors['register-password'] || errors['register-password-confirm']) {
          this.setState({invalid: errors})
          return
        }
        break
      }

      case 3: {
        if (!currentUser.gateway.url) {
          errors['register-gateway-url'] = {
            reason: 'required',
            message: 'This field is required'
          }
        } else {
          delete errors['register-gateway-url']
        }

        if (!currentUser.gateway.username) {
          errors['register-gateway-username'] = {
            reason: 'required',
            message: 'This field is required'
          }
        } else {
          delete errors['register-gateway-username']
        }

        if (!currentUser.gateway.password) {
          errors['register-gateway-password'] = {
            reason: 'required',
            message: 'This field is required'
          }
        } else {
          delete errors['register-gateway-password']
        }

        if (
          errors['register-gateway-url'] ||
          errors['register-gateway-username'] ||
          errors['register-gateway-password']
        ) {
          this.setState({invalid: errors})
          return
        }
        break
      }

      default: {
        break
      }
    }

    this.setState(prevState => ({
      currentIndex: prevState.currentIndex + 1
    }))
  }

  decrementCurrentIndex () {
    this.setState(prevState => ({
      currentIndex: prevState.currentIndex - 1
    }))
  }

  handleInputChange (event) {
    const target = event.target
    const inputfield = target.name
    const value = target.value
    const user = this.state.user
    let errors = this.state.invalid

    if (inputfield.includes('->')) {
      const nestedInput = inputfield.split('->')
      let prop = nestedInput[0]
      let nestedProp = nestedInput[1]
      user[prop][nestedProp] = value
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
        message: 'Your password does not meet the criteria, click on the i for more info'
      }
    }
    this.setState({user: user, invalid: errors})
  }

  handleSubmit (event) {
    event.preventDefault()

    let apiPath = '/api/v1/user'
    let options = {
      method: 'POST',
      json: true,
      body: JSON.stringify(this.state.user),
      headers: {
        'content-type': 'application/json'
      }
    }
    return makeRequest(apiPath, options)
      .then(() => {
        this.setState({
          modalOpen: true,
          modalContent: {
            heading: 'Successfully registered',
            message: [
              <p>You have successfully registered on OpenTRV.</p>,
              <a href='/login' >Click here to go to the login screen</a>
            ]
          }
        })
        // window.location.assign('/login')
      })
      .catch(() => {
        this.setState({
          modalOpen: true,
          modalContent: {
            heading: 'Register Failed',
            message: [
              <p>Failed to register on OpenTRV.</p>,
              <p>Please try again.</p>,
              <p>If problem persists please contact support</p>
            ]
          }
        })
      })
  }

  handleModalOnClick () {
    this.setState({modalOpen: false})
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
    let registerContent

    switch (this.state.currentIndex) {
      case 0: {
        registerContent = (
          <Fragment>
            <FormGroup className='Register__form' legendText=' '>
              <FormItem className='Register__form-item'>
                <TextInput
                  id='register-name'
                  labelText='*Name'
                  name='name'
                  placeholder='Name'
                  value={this.state.user.name}
                  onChange={this.handleInputChange}
                  invalid={this.checkValid('register-name')}
                  invalidText={this.getErrorMessage('register-name')}
                />
              </FormItem>
              <FormItem className='Register__form-item'>
                <TextInput
                  id='register-email'
                  labelText='*Email'
                  name='email'
                  type='email'
                  placeholder='Email address'
                  value={this.state.user.email}
                  onChange={this.handleInputChange}
                  invalid={this.checkValid('register-email')}
                  invalidText={this.getErrorMessage('register-email')}
                />
              </FormItem>
            </FormGroup>
            <FormGroup className='Register__form-buttons' legendText=' '>
              <Button
                kind='secondary'
                className='Register__form-button Register__back-button'
                href='/'
              >
                Back
              </Button>
              <Button
                className='Register__form-button Register__next-button'
                onClick={this.incrementCurrentIndex}
              >
                Next
              </Button>
            </FormGroup>
          </Fragment>
        )
        break
      }

      case 1: {
        registerContent = (
          <Fragment>
            <FormGroup className='Register__form' legendText=' '>
              <FormItem className='Register__form-item'>
                <TextInput
                  id='register-address-firstline'
                  labelText='*Line 1'
                  name='address->firstLine'
                  placeholder='First line'
                  value={this.state.user.address.firstLine}
                  style={{marginRight: 'unset'}}
                  onChange={this.handleInputChange}
                  invalid={this.checkValid('register-address-firstline')}
                  invalidText={this.getErrorMessage('register-address-firstline')}
                />
              </FormItem>
              <FormItem className='Register__form-item'>
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
                    placeholder='Postcode'
                    value={this.state.user.address.postcode}
                    onChange={this.handleInputChange}
                    invalid={this.checkValid('register-address-postcode')}
                    invalidText={this.getErrorMessage('register-address-postcode')}
                  />
                </FormItem>
              </div>
            </FormGroup>
            <FormGroup className='Register__form-buttons' legendText=' '>
              <Button
                kind='secondary'
                className='Register__form-button Register__back-button'
                onClick={this.decrementCurrentIndex}
              >
                Back
              </Button>
              <Button
                className='Register__form-button Register__next-button'
                onClick={this.incrementCurrentIndex}
              >
                Next
              </Button>
            </FormGroup>
          </Fragment>
        )
        break
      }

      case 2: {
        registerContent = (
          <Fragment>
            <FormGroup className='Register__form' legendText=' '>
              <FormLabel>
                <Tooltip triggerText='*Password' clickToOpen>
                  Password must have a minimum of 8 characters including 1 uppercase, 1 lowercase and a number.
                </Tooltip>
              </FormLabel>
              <FormItem className='Register__form-item'>
                <TextInput
                  id='register-password'
                  labelText='*Password'
                  name='password'
                  hideLabel
                  type='password'
                  placeholder='Enter password'
                  value={this.state.user.password}
                  onChange={this.handleInputChange}
                  invalid={this.checkValid('register-password')}
                  invalidText={this.getErrorMessage('register-password')}
                />
              </FormItem>
              <FormItem className='Register__form-item'>
                <TextInput
                  id='register-password-confirm'
                  labelText='*Confirm Password'
                  name='password-confirm'
                  type='password'
                  placeholder='Enter password'
                  onChange={this.handleInputChange}
                  onBlur={this.checkMatch}
                  invalid={this.checkValid('register-password-confirm')}
                  invalidText={this.getErrorMessage('register-password-confirm')}
                />
              </FormItem>
            </FormGroup>
            <FormGroup className='Register__form-buttons' legendText=' '>
              <Button
                kind='secondary'
                className='Register__form-button Register__back-button'
                onClick={this.decrementCurrentIndex}
              >
                Back
              </Button>
              <Button
                className='Register__form-button Register__next-button'
                onClick={this.incrementCurrentIndex}
              >
                Next
              </Button>
            </FormGroup>
          </Fragment>
        )
        break
      }

      case 3: {
        registerContent = (
          <Fragment>
            <FormGroup className='Register__form' legendText=' '>
              <FormItem className='Register__form-item'>
                <TextInput
                  id='register-gateway-url'
                  labelText='*Gateway URL'
                  name='gateway->url'
                  placeholder='Enter Gateway URL'
                  value={this.state.user.gateway.url}
                  onChange={this.handleInputChange}
                  invalid={this.checkValid('register-gateway-url')}
                  invalidText={this.getErrorMessage('register-gateway-url')}
                />
              </FormItem>
              <FormItem className='Register__form-item'>
                <TextInput
                  id='register-gateway-username'
                  labelText='*Gateway Username'
                  name='gateway->username'
                  placeholder='Enter Gateway username'
                  value={this.state.user.gateway.username}
                  onChange={this.handleInputChange}
                  invalid={this.checkValid('register-gateway-username')}
                  invalidText={this.getErrorMessage('register-gateway-username')}
                />
              </FormItem>
              <FormItem className='Register__form-item'>
                <TextInput
                  id='register-gateway-password'
                  labelText='*Gateway Password'
                  name='gateway->password'
                  type='password'
                  placeholder='Enter Gateway Password'
                  value={this.state.user.gateway.password}
                  onChange={this.handleInputChange}
                  invalid={this.checkValid('register-gateway-password')}
                  invalidText={this.getErrorMessage('register-gateway-password')}
                />
              </FormItem>
            </FormGroup>
            <FormGroup className='Register__form-buttons' legendText=' '>
              <Button
                kind='secondary'
                className='Register__form-button Register__back-button'
                onClick={this.decrementCurrentIndex}
              >
                Back
              </Button>
              <Button
                className='Register__form-button Register__next-button'
                onClick={this.incrementCurrentIndex}
              >
                Next
              </Button>
            </FormGroup>
          </Fragment>
        )
        break
      }

      case 4: {
        registerContent = (
          <div className='Register__form'>
            <div className='Register__form-confirm-message'>
              <p>You have successfully filled out all the required fields to create an acccount.</p>
              <p>Please ensure all the information is correct before clicking the register button below</p>
            </div>
            <FormGroup className='Register__form-buttons' legendText=' '>
              <Button
                kind='secondary'
                className='Register__form-button Register__back-button'
                onClick={this.decrementCurrentIndex}
              >
                Back
              </Button>
              <Button
                className='Register__form-button Register__register-button'
                onClick={this.handleSubmit}
              >
                Register
              </Button>
            </FormGroup>
            <Modal
              className='Register__modal'
              open={this.state.modalOpen}
              passiveModal
              modalHeading={this.state.modalContent.heading}
              onRequestClose={this.handleModalOnClick}
            >
              {this.state.modalContent.message}
            </Modal>
          </div>
        )
        break
      }

      default: {
        registerContent = null
        break
      }
    }

    return (
      <div className='Register'>
        <h2 className='Register__title'>Register for an account</h2>
        <div className='Register__progress-container'>
          <div className='Register__progress-centering-div' />
          <div className='Register__progress'>
            <ProgressIndicator currentIndex={this.state.currentIndex}>
              <ProgressStep label='Name' description='Step 1: Name and Email' />
              <ProgressStep label='Address' description='Step 2: Home Address' />
              <ProgressStep label='Password' description='Step 3: Password' />
              <ProgressStep label='Gateway' description='Step 4: Gateway Details' />
              <ProgressStep label='Confirm' description='Step 5: Confirm' />
            </ProgressIndicator>
          </div>
        </div>
        <div className='Register__content'>
          {registerContent}
        </div>
      </div>
    )
  }
}

export default Register

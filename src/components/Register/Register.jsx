import React, { Component } from 'react'
import { Button, Form, FormGroup, TextInput } from 'carbon-components-react'

class Register extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      phone: '',
      password: '',
      address: {
        firstLine: '',
        secondLine: '',
        city: '',
        county: '',
        country: '',
        postcode: ''
      }
    }
  }

  render () {
    return (
      <div className='Register'>
        <h2 className='Register__title'>Register for an account</h2>
        <Form className='Register__form'>
          <FormGroup className='Register__form-name' legendText='Name'>
            <TextInput
              id='register-first-name'
              labelText='*First'
              placeholder='First name'
            />
            <TextInput
              id='register-last-name'
              labelText='*Last'
              placeholder='Last name'
            />
          </FormGroup>
          <FormGroup className='Register__form-address' legendText='Address'>
            <TextInput
              id='register-house-firstline'
              labelText='*Line 1'
              placeholder='First line'
            />
            <TextInput
              id='register-house-secondline'
              labelText='Line 2'
              placeholder='Second line'
            />
            <div style={{display: 'flex'}}>
              <TextInput
                id='register-house-city'
                labelText='City'
                placeholder='City'
              />
              <TextInput
                id='register-house-county'
                labelText='*County'
                placeholder='County'
              />
            </div>
            <div style={{display: 'flex'}}>
              <TextInput
                id='register-house-country'
                labelText='Country'
                placeholder='Country'
              />
              <TextInput
                id='register-house-postcode'
                labelText='*Postcode'
                placeholder='Postcode'
              />
            </div>
          </FormGroup>
          <FormGroup legendText=''>
            <TextInput
              id='register-password'
              labelText='*Password'
              type='password'
              placeholder='Enter password'
            />
            <TextInput
              id='register-password-confirm'
              labelText='*Confirm Password'
              type='password'
              placeholder='Enter password'
            />
          </FormGroup>
          <div className='Register__form-buttons'>
            <Button
              style={{width: '120px'}}
              kind='secondary'
              className='Register__back-button'
              href='/'
            >
              Back
            </Button>
            <Button
              style={{width: '120px'}}
              className='Register__register-button'
            >
              Register
            </Button>
          </div>
        </Form>
      </div>
    )
  }
}

export default Register

import React, { Component } from 'react'
import { Form, TextInput } from 'carbon-components-react'

class Register extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      phone: '',
      password: '',
      address: {
        number: 0,
        road: '',
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
        <h2 className='Register__title'>Title</h2>
        <Form className='Register__form'>
          <TextInput
            id='register-first-name'
            labelText='First'
            placeholder='Enter first name'
          />
          <TextInput
            id='register-last-name'
            labelText='Last'
            placeholder='Enter last name'
          />
        </Form>
      </div>
    )
  }
}

export default Register

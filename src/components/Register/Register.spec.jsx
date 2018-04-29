import React from 'react'
import Register from './Register'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('Register.jsx', () => {
  it('renders without crashing', () => {
    expect(shallow(<Register />)).toMatchSnapshot()
  })

  describe('when the currentIndex state is 0', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(<Register />)
      wrapper.setState({currentIndex: 0})
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('displays the name field', () => {
      expect(wrapper.find('#register-name').length).toBeGreaterThanOrEqual(1)
    })

    it('displays the email field', () => {
      expect(wrapper.find('#register-email').length).toBeGreaterThanOrEqual(1)
    })

    describe('when a user presses the next button without entering values', () => {
      beforeEach(() => {
        wrapper.find('.Register__next-button').at(0).simulate('click')
      })

      it('does not increase the currentIndex', () => {
        expect(wrapper.state('currentIndex')).toEqual(0)
      })

      it('sets an error in the invalid state for the name field', () => {
        expect(wrapper.state('invalid')['register-name']).toBeDefined()
      })

      it('sets an error in the invalid state for the email field', () => {
        expect(wrapper.state('invalid')['register-email']).toBeDefined()
      })
    })

    describe('when a user presses the next button after entering values', () => {
      const name = 'John Doe'
      const email = 'john.doe@example.com'

      beforeEach(() => {
        wrapper.find('input').at(0).simulate('change', { target: { value: name, name: 'name' } })
        wrapper.find('input').at(1).simulate('change', { target: { value: email, name: 'email' } })
        wrapper.find('.Register__next-button').at(0).simulate('click')
      })

      it('increments the currentIndex state', () => {
        expect(wrapper.state('currentIndex')).toEqual(1)
      })
    })
  })

  describe('when the currentIndex state is 1', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(<Register />)
      wrapper.setState({currentIndex: 1})
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('displays the firstline field', () => {
      expect(wrapper.find('#register-address-firstline').length).toBeGreaterThanOrEqual(1)
    })

    it('displays the secondline field', () => {
      expect(wrapper.find('#register-address-secondline').length).toBeGreaterThanOrEqual(1)
    })

    it('displays the city field', () => {
      expect(wrapper.find('#register-address-city').length).toBeGreaterThanOrEqual(1)
    })

    it('displays the county field', () => {
      expect(wrapper.find('#register-address-county').length).toBeGreaterThanOrEqual(1)
    })

    it('displays the country field', () => {
      expect(wrapper.find('#register-address-country').length).toBeGreaterThanOrEqual(1)
    })

    it('displays the postcode field', () => {
      expect(wrapper.find('#register-address-postcode').length).toBeGreaterThanOrEqual(1)
    })

    describe('when a user presses the next button without entering values', () => {
      beforeEach(() => {
        wrapper.find('.Register__next-button').at(0).simulate('click')
      })

      it('does not increase the currentIndex', () => {
        expect(wrapper.state('currentIndex')).toEqual(1)
      })

      it('sets an error in the invalid state for the firstline field', () => {
        expect(wrapper.state('invalid')['register-address-firstline']).toBeDefined()
      })

      it('sets an error in the invalid state for the county field', () => {
        expect(wrapper.state('invalid')['register-address-county']).toBeDefined()
      })

      it('sets an error in the invalid state for the postcode field', () => {
        expect(wrapper.state('invalid')['register-address-postcode']).toBeDefined()
      })
    })

    describe('when a user presses the next button after entering values', () => {
      const firstLine = '123 example street'
      const county = 'exampleton'
      const postcode = 'ab12cd'

      beforeEach(() => {
        wrapper.find('input').at(0).simulate('change', { target: { value: firstLine, name: 'address->firstLine' } })
        wrapper.find('input').at(3).simulate('change', { target: { value: county, name: 'address->county' } })
        wrapper.find('input').at(5).simulate('change', { target: { value: postcode, name: 'address->postcode' } })
        wrapper.find('.Register__next-button').at(0).simulate('click')
      })

      it('increments the currentIndex state', () => {
        expect(wrapper.state('currentIndex')).toEqual(2)
      })
    })

    describe('when a user presses the back button', () => {
      beforeEach(() => {
        wrapper.find('.Register__back-button').at(0).simulate('click')
      })

      it('decrements the currentIndex state', () => {
        expect(wrapper.state('currentIndex')).toEqual(0)
      })
    })
  })

  describe('when the currentIndex state is 2', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(<Register />)
      wrapper.setState({currentIndex: 2})
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('displays the password field', () => {
      expect(wrapper.find('#register-password').length).toBeGreaterThanOrEqual(1)
    })

    it('displays the confirm password field', () => {
      expect(wrapper.find('#register-password-confirm').length).toBeGreaterThanOrEqual(1)
    })

    describe('when a user presses the next button without entering values', () => {
      beforeEach(() => {
        wrapper.find('.Register__next-button').at(0).simulate('click')
      })

      it('does not increase the currentIndex', () => {
        expect(wrapper.state('currentIndex')).toEqual(2)
      })

      it('sets an error in the invalid state for the password field', () => {
        expect(wrapper.state('invalid')['register-password']).toBeDefined()
      })

      it('sets an error in the invalid state for the confirm password field', () => {
        expect(wrapper.state('invalid')['register-password-confirm']).toBeDefined()
      })
    })

    describe('when a user presses the next button after entering values', () => {
      const password = 'P@ssw0rd'
      const confirmPass = 'P@ssw0rd'

      beforeEach(() => {
        wrapper.find('input').at(0).simulate('change', { target: { value: password, name: 'password' } })
        wrapper.find('input').at(1).simulate('change', { target: { value: confirmPass, name: 'password-confirm' } })
        wrapper.find('.Register__next-button').at(0).simulate('click')
      })

      it('increments the currentIndex state', () => {
        expect(wrapper.state('currentIndex')).toEqual(3)
      })
    })

    describe('when a user presses the back button', () => {
      beforeEach(() => {
        wrapper.find('.Register__back-button').at(0).simulate('click')
      })

      it('decrements the currentIndex state', () => {
        expect(wrapper.state('currentIndex')).toEqual(1)
      })
    })
  })

  describe('when the currentIndex state is 3', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(<Register />)
      wrapper.setState({currentIndex: 3})
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('displays the gateway url field', () => {
      expect(wrapper.find('#register-gateway-url').length).toBeGreaterThanOrEqual(1)
    })

    it('displays the gateway username field', () => {
      expect(wrapper.find('#register-gateway-username').length).toBeGreaterThanOrEqual(1)
    })

    it('displays the gateway password field', () => {
      expect(wrapper.find('#register-gateway-password').length).toBeGreaterThanOrEqual(1)
    })

    describe('when a user presses the next button without entering values', () => {
      beforeEach(() => {
        wrapper.find('.Register__next-button').at(0).simulate('click')
      })

      it('does not increase the currentIndex', () => {
        expect(wrapper.state('currentIndex')).toEqual(3)
      })

      it('sets an error in the invalid state for the firstline field', () => {
        expect(wrapper.state('invalid')['register-gateway-url']).toBeDefined()
      })

      it('sets an error in the invalid state for the county field', () => {
        expect(wrapper.state('invalid')['register-gateway-username']).toBeDefined()
      })

      it('sets an error in the invalid state for the postcode field', () => {
        expect(wrapper.state('invalid')['register-gateway-password']).toBeDefined()
      })
    })

    describe('when a user presses the next button after entering values', () => {
      const url = 'http://localhost:3002'
      const user = 'admin'
      const pass = 'pass'

      beforeEach(() => {
        wrapper.find('input').at(0).simulate('change', { target: { value: url, name: 'gateway->url' } })
        wrapper.find('input').at(1).simulate('change', { target: { value: user, name: 'gateway->username' } })
        wrapper.find('input').at(2).simulate('change', { target: { value: pass, name: 'gateway->password' } })
        wrapper.find('.Register__next-button').at(0).simulate('click')
      })

      it('increments the currentIndex state', () => {
        expect(wrapper.state('currentIndex')).toEqual(4)
      })
    })

    describe('when a user presses the back button', () => {
      beforeEach(() => {
        wrapper.find('.Register__back-button').at(0).simulate('click')
      })

      it('decrements the currentIndex state', () => {
        expect(wrapper.state('currentIndex')).toEqual(2)
      })
    })
  })

  describe('when the currentIndex state is 4', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(<Register />)
      wrapper.setState({currentIndex: 4})
    })

    afterEach(() => {
      wrapper.unmount()
    })

    describe('when a user presses the back button', () => {
      beforeEach(() => {
        wrapper.find('.Register__back-button').at(0).simulate('click')
      })

      it('decrements the currentIndex state', () => {
        expect(wrapper.state('currentIndex')).toEqual(3)
      })
    })
  })
})

import React from 'react'
import Login from './Login'
import { setAuthenticated } from '../../utils/auth'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('Login.jsx', () => {
  it('renders without crashing', () => {
    expect(shallow(<Login />)).toMatchSnapshot()
  })

  describe('when the user is already authenticated', () => {
    let wrapper

    beforeEach(() => {
      setAuthenticated(true)
      window.location.assign = jest.fn()
      wrapper = shallow(<Login />)
    })

    afterEach(() => {
      jest.resetAllMocks()
      wrapper.unmount()
    })

    it('calls window.location.assign', () => {
      expect(window.location.assign).toHaveBeenCalledTimes(1)
    })

    it('calls window.location.assign with "/overview"', () => {
      expect(window.location.assign).toHaveBeenCalledWith('/overview')
    })
  })

  describe('when the user enters their email into the email input', () => {
    let wrapper

    beforeEach(() => {
      setAuthenticated(false)
      wrapper = mount(<Login />)
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('changes the state to equal what the user has entered', () => {
      wrapper.find('#login-email').at(1).simulate('change', { target: { value: 'john.doe@example.com' } })
      expect(wrapper.state().email).toEqual('john.doe@example.com')
    })
  })

  describe('when the user enters their password into the password input', () => {
    let wrapper

    beforeEach(() => {
      setAuthenticated(false)
      wrapper = mount(<Login />)
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('changes the state to equal what the user has entered', () => {
      wrapper.find('#login-password').at(1).simulate('change', { target: { value: 'password' } })
      expect(wrapper.state().password).toEqual('password')
    })
  })

  describe('when a valid user attempts to login', () => {
    let wrapper

    beforeEach(() => {
      setAuthenticated(false)
      window.location.assign = jest.fn()
      wrapper = mount(<Login />)
      wrapper.find('#login-email').at(1).simulate('change', { target: { value: 'john.doe@example.com' } })
      wrapper.find('#login-password').at(1).simulate('change', { target: { value: 'password' } })
      wrapper.find('.Login__login-button').at(0).simulate('click')
    })

    afterEach(() => {
      jest.resetAllMocks()
      wrapper.unmount()
    })

    it('calls window.location.assign', () => {
      expect(window.location.assign).toHaveBeenCalledTimes(1)
    })

    it('calls window.location.assign with "/overview"', () => {
      expect(window.location.assign).toHaveBeenCalledWith('/overview')
    })
  })

  describe('when a invalid user attempts to login', () => {
    let wrapper

    beforeEach(() => {
      setAuthenticated(false)
      window.location.assign = jest.fn()
      wrapper = mount(<Login />)
      wrapper.find('#login-email').at(1).simulate('change', { target: { value: 'bad.person@example.com' } })
      wrapper.find('#login-password').at(1).simulate('change', { target: { value: 'password' } })
      wrapper.find('.Login__login-button').at(0).simulate('click')
    })

    afterEach(() => {
      jest.resetAllMocks()
      wrapper.unmount()
    })

    it('does not call window.location.assign', () => {
      expect(window.location.assign).toHaveBeenCalledTimes(0)
    })

    it('sets the failedLogin state to true', () => {
      expect(wrapper.state().failedLogin).toEqual(true)
    })

    it('displays the modal', () => {
      let modal = wrapper.find('.Login__failed-modal').at(0).instance()
      expect(modal.props.open).toEqual(true)
    })

    describe('when the modal is displayed', () => {
      it('closes when the cross is clicked', () => {
        wrapper.find('.bx--modal-close').at(0).simulate('click')
        expect(wrapper.state().failedLogin).toEqual(false)
      })
    })
  })
})

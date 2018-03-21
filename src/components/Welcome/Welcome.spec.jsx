import React from 'react'
import Welcome from './Welcome'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('Welcome.jsx', () => {
  it('renders without crashing', () => {
    expect(shallow(<Welcome />)).toMatchSnapshot()
  })

  describe('when the register button is pressed', () => {
    let wrapper

    beforeEach(() => {
      global.location.assign = jest.fn()
      wrapper = mount(<Welcome />)
      wrapper.find('.Welcome__register-button').at(1).simulate('click')
    })

    afterEach(() => {
      jest.resetAllMocks()
      wrapper.unmount()
    })

    it('calls global.location.assign', () => {
      expect(global.location.assign).toHaveBeenCalledTimes(1)
    })

    it('calls global.location.assign with "/register"', () => {
      expect(global.location.assign).toBeCalledWith('/register')
    })
  })

  describe('when the login button is pressed', () => {
    let wrapper

    beforeEach(() => {
      global.location.assign = jest.fn()
      wrapper = mount(<Welcome />)
      wrapper.find('.Welcome__login-button').at(1).simulate('click')
    })

    afterEach(() => {
      jest.resetAllMocks()
      wrapper.unmount()
    })

    it('calls global.location.assign', () => {
      expect(global.location.assign).toHaveBeenCalledTimes(1)
    })

    it('calls global.location.assign with "/login"', () => {
      expect(global.location.assign).toBeCalledWith('/login')
    })
  })
})

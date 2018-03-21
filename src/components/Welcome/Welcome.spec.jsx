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
    let consoleLogSpy

    beforeEach(() => {
      consoleLogSpy = jest.spyOn(console, 'log')
      wrapper = mount(<Welcome />)
      wrapper.find('.Welcome__register-button').at(1).simulate('click')
    })

    afterEach(() => {
      consoleLogSpy.mockReset()
      wrapper.unmount()
    })

    it('calls console.log', () => {
      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
    })

    it('calls console.log with "registered"', () => {
      expect(consoleLogSpy).toBeCalledWith('registered')
    })
  })

  describe('when the login button is pressed', () => {
    let wrapper
    let consoleLogSpy

    beforeEach(() => {
      consoleLogSpy = jest.spyOn(console, 'log')
      wrapper = mount(<Welcome />)
      wrapper.find('.Welcome__login-button').at(1).simulate('click')
    })

    afterEach(() => {
      consoleLogSpy.mockReset()
      wrapper.unmount()
    })

    it('calls console.log', () => {
      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
    })

    it('calls console.log with "logged in"', () => {
      expect(consoleLogSpy).toBeCalledWith('logged in')
    })
  })
})

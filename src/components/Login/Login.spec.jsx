import React from 'react'
import Login from './Login'
import { setAuthenticated } from '../../utils/auth'
import Enzyme, { shallow } from 'enzyme'
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
})

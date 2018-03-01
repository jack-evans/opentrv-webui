import React from 'react'
import Overview from './Overview'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

const nock = require('nock')

Enzyme.configure({ adapter: new Adapter() })

describe('Overview.jsx', () => {
  it('renders without crashing', () => {
    expect(shallow(<Overview />)).toMatchSnapshot()
  })

  it('calls the componentDidMount function when it is created', () => {
    const componentDidMountSpy = jest.spyOn(Overview.prototype, 'componentDidMount')
    mount(<Overview />)
    expect(componentDidMountSpy).toHaveBeenCalledTimes(1)
    componentDidMountSpy.mockRestore()
  })

  describe('componentDidMount', () => {
    let getNock

    beforeEach(() => {
      jest.useFakeTimers()
      getNock = nock('http://localhost:3001')
        .get('/api/v1/devices')
    })

    afterEach(() => {
      jest.useRealTimers()
      nock.cleanAll()
    })

    it('sets the devices state to an empty array when retrieve devices returns an empty array', () => {
      getNock.reply(200, [])
      const wrapper = mount(<Overview />)
      expect(wrapper.state('devices')).toEqual([])
    })

    it.skip('sets the devices state to an array of devices when retrieve devices returns devices', () => {
      getNock.reply(200, [{id: '1234'}])
      const wrapper = shallow(<Overview />)
      expect(wrapper.state('devices')).toEqual([])
      jest.runAllTimers()
      wrapper.update()
      expect(wrapper.state('devices')).toEqual([{id: '1234'}])
    })
  })
})

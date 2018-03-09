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

  it('displays a loading panel when rendered', () => {
    const wrapper = mount(<Overview />)
    expect(wrapper.find('.Overview__content-loading')).toHaveLength(1)
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
      const wrapper = mount(<Overview />)

      expect(wrapper.state('devices')).toEqual([])
      return Promise.resolve()
        .then(() => {
          jest.runAllTimers()
          wrapper.update()
          let component = wrapper.instance()
          component.forceUpdate()
          expect(component.state.devices).toEqual([{id: '1234'}])
        })
    })
  })

  describe('when no devices are found on the server', () => {
    let wrapper

    beforeAll(() => {
      wrapper = mount(<Overview />)
      wrapper.setState({devices: [], visibleDevices: [], isLoading: false})
    })

    afterAll(() => {
      wrapper.unmount()
    })

    it('renders a empty message', () => {
      expect(wrapper.find('.Overview__content-empty')).toHaveLength(1)
    })

    it('renders a discover devices button', () => {
      expect(wrapper.find('.Overview__discover-button').length).toBeGreaterThan(1)
    })
  })

  describe('when devices are found on the server', () => {
    let wrapper
    let devicesFromServer = [
      {
        'id': '6f710966-c2da-4998-9bce-d4ba8971068d',
        'currentTemperature': 24.2,
        'ambientTemperature': 18,
        'name': 'living room - radiator 1',
        'serialId': 'OTRV-BXTI97EO1I',
        'active': false,
        'activeSchedules': [],
        'metadata': {}
      }, {
        'id': 'b9c23059-4e38-4e2f-b191-3c0ceec0cdcd',
        'currentTemperature': 23.3,
        'ambientTemperature': 18,
        'name': 'Device 8',
        'serialId': 'OTRV-2SHCM8CLUL',
        'active': false,
        'activeSchedules': [],
        'metadata': {}
      }, {
        'id': 'cf2a7c5e-5fc9-420a-a8ca-0e59287c4b7e',
        'currentTemperature': 31.9,
        'ambientTemperature': 18,
        'name': 'Device 2',
        'serialId': 'OTRV-5GZ3VMLVY2',
        'active': false,
        'activeSchedules': [],
        'metadata': {}
      }
    ]

    beforeAll(() => {
      wrapper = mount(<Overview />)
      wrapper.setState({devices: devicesFromServer, visibleDevices: devicesFromServer, isLoading: false})
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('renders a matching number of DeviceTiles', () => {
      expect(wrapper.find('.DeviceTile')).toHaveLength(devicesFromServer.length)
    })
  })
})

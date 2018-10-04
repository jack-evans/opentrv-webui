import React from 'react'
import DeviceOverview from './DeviceOverview'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { getToken } from '../../utils/auth'
jest.mock('../../utils/auth')

const nock = require('nock')

Enzyme.configure({ adapter: new Adapter() })

describe('DeviceOverview.jsx', () => {
  beforeEach(() => {
    getToken.mockReturnValue('fakeJWT')
  })

  it('renders without crashing', () => {
    expect(shallow(<DeviceOverview />)).toMatchSnapshot()
  })

  it('calls the componentDidMount function when it is created', () => {
    const componentDidMountSpy = jest.spyOn(DeviceOverview.prototype, 'componentDidMount')
    mount(<DeviceOverview />)
    expect(componentDidMountSpy).toHaveBeenCalledTimes(1)
    componentDidMountSpy.mockRestore()
  })

  it('displays a loading panel when rendered', () => {
    const wrapper = mount(<DeviceOverview />)
    expect(wrapper.find('.DeviceOverview__content-loading')).toHaveLength(1)
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
      const wrapper = mount(<DeviceOverview />)
      expect(wrapper.state('devices')).toEqual([])
    })

    it.skip('sets the devices state to an array of devices when retrieve devices returns devices', () => {
      getNock.reply(200, [{id: '1234'}])
      const wrapper = mount(<DeviceOverview />)

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
      wrapper = mount(<DeviceOverview />)
      wrapper.setState({devices: [], visibleDevices: [], isLoading: false})
    })

    afterAll(() => {
      wrapper.unmount()
    })

    it('renders a empty message', () => {
      expect(wrapper.find('.DeviceOverview__content-empty')).toHaveLength(1)
    })

    it('renders a discover devices button', () => {
      expect(wrapper.find('.DeviceOverview__discover-button').length).toBeGreaterThan(1)
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

    beforeEach(() => {
      wrapper = mount(<DeviceOverview />)
      wrapper.setState({devices: devicesFromServer, visibleDevices: devicesFromServer, isLoading: false})
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('renders a matching number of DeviceTiles', () => {
      expect(wrapper.find('.DeviceTile')).toHaveLength(devicesFromServer.length)
    })
  })

  describe('when a user searches through their devices', () => {
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

    beforeEach(() => {
      wrapper = mount(<DeviceOverview />)
      wrapper.setState({devices: devicesFromServer, visibleDevices: devicesFromServer, isLoading: false})
      wrapper.find('input').simulate('change', { target: { value: 'device' } })
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('sets visible devices to the 2 valid devices', () => {
      expect(wrapper.state('visibleDevices').length).toEqual(2)
    })

    it('displays only 2 of the 3 DeviceTiles', () => {
      expect(wrapper.find('.DeviceTile')).toHaveLength(2)
    })
  })

  describe('when a user presses delete on a DeviceTile', () => {
    let wrapper
    let deleteDeviceSpy
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
      }
    ]

    beforeEach(() => {
      wrapper = shallow(<DeviceOverview />)
      wrapper.setState({devices: devicesFromServer, visibleDevices: devicesFromServer, isLoading: false})
      deleteDeviceSpy = jest.spyOn(DeviceOverview.prototype, 'deleteDevice')

      wrapper.find('DeviceTile').prop('handleDelete')()
    })

    afterEach(() => {
      wrapper.unmount()
      deleteDeviceSpy.mockReset()
    })

    it('calls the deleteDevice function', () => {
      expect(deleteDeviceSpy).toHaveBeenCalledTimes(1)
    })

    it('calls the deleteDevice function with the id of the Device', () => {
      expect(deleteDeviceSpy).toHaveBeenCalledWith(devicesFromServer[0].id)
    })
  })
})

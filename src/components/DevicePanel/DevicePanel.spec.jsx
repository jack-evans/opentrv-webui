import React from 'react'
import DevicePanel from './DevicePanel'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { getToken } from '../../utils/auth'
jest.mock('../../utils/auth')

Enzyme.configure({ adapter: new Adapter() })

describe('DevicePanel.jsx', () => {
  const match = {
    params: {
      id: '1234'
    }
  }

  beforeEach(() => {
    getToken.mockReturnValue('fakeJWT')
  })

  it('renders without crashing', () => {
    expect(shallow(<DevicePanel match={match} />)).toMatchSnapshot()
  })

  describe('when the isLoading state is true', () => {
    it('returns null', () => {
      const wrapper = shallow(<DevicePanel match={match} />)
      expect(wrapper.type()).toBe(null)
    })
  })

  describe('when the isLoading state is false', () => {
    let wrapper
    let device = {
      id: '1234',
      name: 'test',
      currentTemperature: 23.4,
      ambientTemperature: 19.3,
      targetTemperature: 21.4,
      serialId: 'OTRV-1A2B3C4D'
    }

    beforeEach(() => {
      wrapper = shallow(<DevicePanel match={match} />)
      wrapper.setState({isLoading: false, device: device})
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('returns the component', () => {
      expect(wrapper.find('.DevicePanel')).toHaveLength(1)
    })

    it('sets the name input to "test"', () => {
      expect(wrapper.find('#device-name').props().value).toEqual(device.name)
    })

    it('sets the serial number input to "OTRV-1A2B3C4D"', () => {
      expect(wrapper.find('#device-serial-number').props().value).toEqual(device.serialId)
    })

    it('sets the target temperature input to 21.4', () => {
      expect(wrapper.find('#device-target-temperature').props().value).toEqual(device.targetTemperature)
    })

    it('sets the current temperature display to 23.4', () => {
      expect(wrapper.find('.DevicePanel__current-temperature-display h3').props().children[0]).toEqual(device.currentTemperature)
    })

    it('sets the ambient temperature display to 19.3', () => {
      expect(wrapper.find('.DevicePanel__ambient-temperature-display h3').props().children[0]).toEqual(device.ambientTemperature)
    })
  })

  describe('when a user edits the name input box', () => {
    let wrapper
    let handleDeviceNameChangeEventSpy
    let device = {
      id: '1234',
      name: 'test',
      currentTemperature: 23.4,
      ambientTemperature: 19.3,
      targetTemperature: 21.4,
      serialId: 'OTRV-1A2B3C4D'
    }

    beforeEach(() => {
      handleDeviceNameChangeEventSpy = jest.spyOn(DevicePanel.prototype, 'handleDeviceNameChangeEvent')
      wrapper = mount(<DevicePanel match={match} />)
      wrapper.setState({isLoading: false, device: device})
      wrapper.find('input').at(0).simulate('change', { target: { value: 'my device' } })
    })

    afterEach(() => {
      handleDeviceNameChangeEventSpy.mockReset()
      wrapper.unmount()
    })

    it('calls the handleDeviceNameChangeEvent', () => {
      expect(handleDeviceNameChangeEventSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('when the device name input contains errors', () => {
    let wrapper
    let device = {
      id: '1234',
      name: 'test',
      currentTemperature: 23.4,
      ambientTemperature: 19.3,
      targetTemperature: 21.4,
      serialId: 'OTRV-1A2B3C4D'
    }

    let error = {
      'device-name': {
        reason: 'exists',
        message: 'The device name already exists'
      }
    }

    beforeEach(() => {
      wrapper = mount(<DevicePanel match={match} />)
      wrapper.setState({isLoading: false, device: device, invalid: error})
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('sets the invalid property of TextInput to true', () => {
      expect(wrapper.find('#device-name').at(0).props().invalid).toBe(true)
    })

    it('sets the invalidText property of TextInput to the error message', () => {
      expect(wrapper.find('#device-name').at(0).props().invalidText).toEqual(error['device-name'].message)
    })
  })
})

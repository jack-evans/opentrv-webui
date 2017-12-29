import React from 'react'
import DeviceTile from './DeviceTile'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('DeviceTile.jsx', () => {
  it('renders without crashing', () => {
    expect(shallow(<DeviceTile id='1234' name='test' temp={26.3} active={false} />)).toMatchSnapshot()
  })

  describe('when the device is not active (false)', () => {
    it('sets the footer class to DeviceTile__footer-idle', () => {
      const wrapper = shallow(<DeviceTile id='1234' name='test' temp={26.3} active={false} />)
      expect(wrapper.find('.DeviceTile__footer-idle')).toHaveLength(1)
    })

    it('sets the activity circle class to DeviceTile__footer-idle-circle', () => {
      const wrapper = shallow(<DeviceTile id='1234' name='test' temp={26.3} active={false} />)
      expect(wrapper.find('.DeviceTile__footer-idle-circle')).toHaveLength(1)
    })

    it('sets the activity content to be "Idle"', () => {
      const wrapper = shallow(<DeviceTile id='1234' name='test' temp={26.3} active={false} />)
      expect(wrapper.text()).toContain('Idle')
    })
  })

  describe('when the device is active (true)', () => {
    it('sets the footer class to DeviceTile__footer-active', () => {
      const wrapper = shallow(<DeviceTile id='1234' name='test' temp={26.3} active />)
      expect(wrapper.find('.DeviceTile__footer-active')).toHaveLength(1)
    })

    it('sets the activity circle class to DeviceTile__footer-active-circle', () => {
      const wrapper = shallow(<DeviceTile id='1234' name='test' temp={26.3} active />)
      expect(wrapper.find('.DeviceTile__footer-active-circle')).toHaveLength(1)
    })

    it('sets the activity content to be "Active"', () => {
      const wrapper = shallow(<DeviceTile id='1234' name='test' temp={26.3} active />)
      expect(wrapper.text()).toContain('Active')
    })
  })

  describe('when the DeviceTile is clicked on', () => {
    it('calls the assign method for window.location', () => {
      global.location.assign = jest.fn()

      const wrapper = shallow(<DeviceTile id='1234' name='test' temp={26.3} active />)
      wrapper.find('.DeviceTile__center-container').simulate('click')

      expect(global.location.assign).toHaveBeenCalledTimes(1)
    })

    it('calls the assign method for window.location', () => {
      global.location.assign = jest.fn()

      const wrapper = shallow(<DeviceTile id='1234' name='test' temp={26.3} active />)
      wrapper.find('.DeviceTile__center-container').simulate('click')

      expect(global.location.assign).toHaveBeenCalledWith('/devices/1234')
    })
  })
})

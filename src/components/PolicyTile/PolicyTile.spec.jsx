import React from 'react'
import PolicyTile from './PolicyTile'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('PolicyTile.jsx', () => {
  it('renders without crashing', () => {
    expect(shallow(<PolicyTile id='1234' name='test' temp={26.3} active={false} />)).toMatchSnapshot()
  })

  describe('when the Policy is not active (false)', () => {
    it('sets the footer class to PolicyTile__footer-idle', () => {
      const wrapper = shallow(<PolicyTile id='1234' name='test' temp={26.3} active={false} />)
      expect(wrapper.find('.PolicyTile__footer-idle')).toHaveLength(1)
    })

    it('sets the activity circle class to PolicyTile__footer-idle-circle', () => {
      const wrapper = shallow(<PolicyTile id='1234' name='test' temp={26.3} active={false} />)
      expect(wrapper.find('.PolicyTile__footer-idle-circle')).toHaveLength(1)
    })

    it('sets the activity content to be "Idle"', () => {
      const wrapper = shallow(<PolicyTile id='1234' name='test' temp={26.3} active={false} />)
      expect(wrapper.text()).toContain('Idle')
    })
  })

  describe('when the Policy is active (true)', () => {
    it('sets the footer class to PolicyTile__footer-active', () => {
      const wrapper = shallow(<PolicyTile id='1234' name='test' temp={26.3} active />)
      expect(wrapper.find('.PolicyTile__footer-active')).toHaveLength(1)
    })

    it('sets the activity circle class to PolicyTile__footer-active-circle', () => {
      const wrapper = shallow(<PolicyTile id='1234' name='test' temp={26.3} active />)
      expect(wrapper.find('.PolicyTile__footer-active-circle')).toHaveLength(1)
    })

    it('sets the activity content to be "Active"', () => {
      const wrapper = shallow(<PolicyTile id='1234' name='test' temp={26.3} active />)
      expect(wrapper.text()).toContain('Active')
    })
  })

  describe('when the PolicyTile is clicked on', () => {
    it('calls the assign method for window.location', () => {
      global.location.assign = jest.fn()

      const wrapper = shallow(<PolicyTile id='1234' name='test' temp={26.3} active />)
      wrapper.find('.PolicyTile__center-container').simulate('click')

      expect(global.location.assign).toHaveBeenCalledTimes(1)
    })

    it('calls the assign method for window.location', () => {
      global.location.assign = jest.fn()

      const wrapper = shallow(<PolicyTile id='1234' name='test' temp={26.3} active />)
      wrapper.find('.PolicyTile__center-container').simulate('click')

      expect(global.location.assign).toHaveBeenCalledWith('/policys/1234')
    })
  })

  describe('when the PolicyTile overflow menu is clicked on', () => {
    describe('when view is clicked on', () => {
      it('calls the assign method for window.location', () => {
        global.location.assign = jest.fn()

        const wrapper = shallow(<PolicyTile id='1234' name='test' temp={26.3} active />)
        wrapper.find('.PolicyTile__overflow-menu-view').simulate('click')

        expect(global.location.assign).toHaveBeenCalledTimes(1)
      })

      it('calls the assign method for window.location', () => {
        global.location.assign = jest.fn()

        const wrapper = shallow(<PolicyTile id='1234' name='test' temp={26.3} active />)
        wrapper.find('.PolicyTile__overflow-menu-view').simulate('click')

        expect(global.location.assign).toHaveBeenCalledWith('/policys/1234')
      })
    })
  })
})

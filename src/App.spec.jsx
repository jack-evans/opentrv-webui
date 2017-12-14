import React from 'react'
import App from './App'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('App.jsx', () => {
  'use strict'

  it('renders without crashing', () => {
    expect(JSON.stringify(
      Object.assign({}, App, { _reactInternalInstance: 'censored' })
    )).toMatchSnapshot()
  })

  it('renders with the state of sideBarMenuOpen set to false', () => {
    const wrapper = shallow(<App />)
    expect(wrapper.state().sideBarMenuOpen).toBe(false)
  })

  describe('when the menu button is clicked', () => {
    it('changes the state of sideBarMenuOpen', () => {
      const wrapper = shallow(<App />)
      expect(wrapper.state().sideBarMenuOpen).toBe(false)
      wrapper.find('Header').simulate('click')
      expect(wrapper.state().sideBarMenuOpen).toBe(true)
    })

    describe('multiple times', () => {
      it('changes the state of sideBarMenuOpen', () => {
        const wrapper = shallow(<App />)
        expect(wrapper.state().sideBarMenuOpen).toBe(false)
        wrapper.find('Header').simulate('click')
        expect(wrapper.state().sideBarMenuOpen).toBe(true)
        wrapper.find('Header').simulate('click')
        expect(wrapper.state().sideBarMenuOpen).toBe(false)
        wrapper.find('Header').simulate('click')
        expect(wrapper.state().sideBarMenuOpen).toBe(true)
      })
    })
  })
})

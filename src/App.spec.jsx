import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { shallow } from 'enzyme'

describe('App.jsx', () => {
  'use strict'

  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<App />, div)
  })

  describe('when the menu button is clicked', () => {
    it('changes the state of sideBarMenuOpen', () => {
      const wrapper = shallow(<App />)
      expect(wrapper.state().sideBarMenuOpen).toBe(false)
      wrapper.find('Header').simulate('click')
      expect(wrapper.state().sideBarMenuOpen).toBe(true)
    })
  })
})

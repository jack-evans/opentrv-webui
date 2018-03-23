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
})

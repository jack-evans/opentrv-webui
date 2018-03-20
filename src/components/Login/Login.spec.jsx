import React from 'react'
import Login from './Login'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('Login.jsx', () => {
  it('renders without crashing', () => {
    expect(shallow(<Login />)).toMatchSnapshot()
  })
})

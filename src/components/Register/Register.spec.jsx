import React from 'react'
import Register from './Register'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('Register.jsx', () => {
  it('renders without crashing', () => {
    expect(shallow(<Register />)).toMatchSnapshot()
  })
})

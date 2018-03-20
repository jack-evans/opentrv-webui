import React from 'react'
import Welcome from './Welcome'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('Welcome.jsx', () => {
  it('renders without crashing', () => {
    expect(shallow(<Welcome />)).toMatchSnapshot()
  })
})

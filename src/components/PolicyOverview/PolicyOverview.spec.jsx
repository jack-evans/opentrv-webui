import React from 'react'
import PolicyOverview from './PolicyOverview'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('PolicyOverview.jsx', () => {
  it('renders without crashing', () => {
    expect(shallow(<PolicyOverview />)).toMatchSnapshot()
  })
})

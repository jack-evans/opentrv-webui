import React from 'react'
import Overview from './Overview'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('Overview.jsx', () => {
  it('renders without crashing', () => {
    expect(shallow(<Overview />)).toMatchSnapshot()
  })
})

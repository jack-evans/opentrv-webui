import React from 'react'
import DeviceTile from './DeviceTile'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('DeviceTile.jsx', () => {
  it('renders without crashing', () => {
    expect(shallow(<DeviceTile name='test' temp={26.3} active={false} />)).toMatchSnapshot()
  })
})

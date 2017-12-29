import React from 'react'
import AnotherDisplay from './DevicePanel'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('AnotherDisplay.jsx', () => {
  it('renders without crashing', () => {
    const match = {
      params: {
        id: '1234'
      }
    }

    expect(shallow(<AnotherDisplay match={match} />)).toMatchSnapshot()
  })
})

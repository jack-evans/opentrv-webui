import React from 'react'
import DevicePanel from './DevicePanel'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('DevicePanel.jsx', () => {
  it('renders without crashing', () => {
    const match = {
      params: {
        id: '1234'
      }
    }

    expect(shallow(<DevicePanel match={match} />)).toMatchSnapshot()
  })
})

import React from 'react'
import DevicePanel from './DevicePanel'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('DevicePanel.jsx', () => {
  const match = {
    params: {
      id: '1234'
    }
  }

  it('renders without crashing', () => {
    expect(shallow(<DevicePanel match={match} />)).toMatchSnapshot()
  })

  describe('when the isLoading state is true', () => {
    it('returns null', () => {
      const wrapper = shallow(<DevicePanel match={match} />)
      expect(wrapper.type()).toBe(null)
    })
  })

  describe('when the isLoading state is false', () => {
    it('returns the component', () => {
      const wrapper = shallow(<DevicePanel match={match} />)
      wrapper.setState({isLoading: false})
      expect(wrapper.find('.DevicePanel')).toHaveLength(1)
    })
  })
})

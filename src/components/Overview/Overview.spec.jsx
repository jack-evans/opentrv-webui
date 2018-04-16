import React from 'react'
import Overview from './Overview'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('Overview.jsx', () => {
  it('renders without crashing', () => {
    expect(shallow(<Overview />)).toMatchSnapshot()
  })

  describe('when the tabSelected state is 0', () => {
    it('renders the DeviceOverview', () => {
      const wrapper = shallow(<Overview />)
      wrapper.setState({tabSelected: 0})
      expect(wrapper.find('DeviceOverview')).toHaveLength(1)
    })
  })

  describe('when the tabSelected state is 1', () => {
    it('renders the PolicyOverview', () => {
      const wrapper = shallow(<Overview />)
      wrapper.setState({tabSelected: 1})
      expect(wrapper.find('PolicyOverview')).toHaveLength(1)
    })
  })

  describe('when the tabSelected state is another number', () => {
    it('renders null', () => {
      const wrapper = shallow(<Overview />)
      wrapper.setState({tabSelected: 1000})
      expect(wrapper.find('PolicyOverview')).toHaveLength(0)
    })
  })
})

import React from 'react'
import Overview from './Overview'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('Overview.jsx', () => {
  it('renders without crashing', () => {
    expect(shallow(<Overview />)).toMatchSnapshot()
  })

  it('calls the componentDidMount function when it is created', () => {
    const componentDidMountSpy = jest.spyOn(Overview.prototype, 'componentDidMount')
    mount(<Overview />)
    expect(componentDidMountSpy).toHaveBeenCalledTimes(1)
    componentDidMountSpy.mockRestore()
  })
})

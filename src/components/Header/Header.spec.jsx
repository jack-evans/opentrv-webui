import React from 'react'
import Header from './Header'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('Header..jsx', () => {
  it('renders without crashing', () => {
    const cbFunction = () => {}
    expect(shallow(<Header onClick={cbFunction} />)).toMatchSnapshot()
  })

  describe('when the button is clicked', () => {
    it('calls the callback function', () => {
      expect.assertions(1)

      const cbFunction = () => {
        expect(1).toEqual(1)
      }

      const wrapper = shallow(<Header onClick={cbFunction} />)
      wrapper.find('button').simulate('click')
    })
  })

  describe('when the isOpen property is true', () => {
    it('has applied the Header__left-nav-toggle--active class to the button', () => {
      const cbFunction = () => {}
      expect(shallow(<Header onClick={cbFunction} isOpen />)).toMatchSnapshot()
    })
  })
})

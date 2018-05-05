import React from 'react'
import SideBarMenu from './SideBarMenu'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('SideBarMenu.jsx', () => {
  it('renders without crashing', () => {
    expect(shallow(<SideBarMenu isOpen={false} />)).toMatchSnapshot()
  })

  describe('when isOpen is true', () => {
    it('renders with the SideBarMenu__open class', () => {
      expect(shallow(<SideBarMenu isOpen />)).toMatchSnapshot()
    })
  })
})

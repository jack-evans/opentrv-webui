import React from 'react'
import SideBarMenuItem from './SideBarMenuItem'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('SideBarMenuItem.jsx', () => {
  it('renders without crashing', () => {
    expect(shallow(<SideBarMenuItem href='https://test.com' text='this is a test' />)).toMatchSnapshot()
  })
})

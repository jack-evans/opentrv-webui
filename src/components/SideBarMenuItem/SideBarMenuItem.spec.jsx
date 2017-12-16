import React from 'react'
import SideBarMenuItem from './SideBarMenuItem'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('SideBarMenuItem.jsx', () => {
  it('renders without crashing', () => {
    const expectedRender = (
      <a className='SideBarMenuItem' href='https://test.com' target='_blank' rel='noopener'>
        <span className='SideBarMenuItem__content'>
          <h3>this is a test</h3>
        </span>
      </a>
    )
    expect(shallow(<SideBarMenuItem href='https://test.com' text='this is a test' />).contains(expectedRender)).toBe(true)
  })
})

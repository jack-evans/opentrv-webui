import React from 'react'
import { shallow } from 'enzyme'
import SideBarMenuItem from './SideBarMenuItem'

describe('SideBarMenuItem.jsx', () => {
  it('renders without crashing', () => {
    const expectedRender = (
      <div>
        SideBarMenuItem
      </div>
    )
    expect(shallow(<SideBarMenuItem />).contains(expectedRender)).toBe(true)
  })
})

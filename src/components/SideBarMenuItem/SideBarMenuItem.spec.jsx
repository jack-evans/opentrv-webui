import React from 'react'
import { shallow } from 'enzyme'
import SideBarMenuItem from './SideBarMenuItem'

describe('SideBarMenuItem.jsx', () => {
  it('renders without crashing', () => {
    const expectedRender = (
      <div className='SideBarMenuItem'>
        <a className='SideBarMenuItem__content' href='https://test.com' target='_blank' rel='noopener'>
          <h3>this is a test</h3>
        </a>
      </div>
    )
    expect(shallow(<SideBarMenuItem href='https://test.com' text='this is a test' />).contains(expectedRender)).toBe(true)
  })
})

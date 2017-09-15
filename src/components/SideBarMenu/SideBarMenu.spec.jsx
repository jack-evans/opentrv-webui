import React from 'react'
import { shallow } from 'enzyme'
import SideBarMenu from './SideBarMenu'
import SideBarMenuItem from '../SideBarMenuItem/SideBarMenuItem'

describe('SideBarMenu.jsx', () => {
  it('renders without crashing', () => {
    const expectedRender = (
      <div className='SideBarMenu'>
        <SideBarMenuItem key={0} href='https://facebook.github.io/react/' text='About React' />
        <SideBarMenuItem key={1} href='https://httpbin.org' text='httpbin.org' />
      </div>
    )
    expect(shallow(<SideBarMenu isOpen={false} />).contains(expectedRender)).toBe(true)
  })

  describe('when isOpen is true', () => {
    it('renders with the SideBarMenu__open class', () => {
      const expectedRender = (
        <div className='SideBarMenu SideBarMenu__open'>
          <SideBarMenuItem key={0} href='https://facebook.github.io/react/' text='About React' />
          <SideBarMenuItem key={1} href='https://httpbin.org' text='httpbin.org' />
        </div>
      )
      expect(shallow(<SideBarMenu isOpen />).contains(expectedRender)).toBe(true)
    })
  })
})

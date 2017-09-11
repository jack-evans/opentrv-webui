import React from 'react'
import { shallow } from 'enzyme'
import SideBarMenu from './SideBarMenu'

describe('SideBarMenu.jsx', () => {
  it('renders without crashing', () => {
    const expectedRender = (
      <div className='SideBarMenu'>
        <div>I slide into view</div>
        <div>Me too!</div>
        <div>Meee Threeeee!</div>
      </div>
    )
    expect(shallow(<SideBarMenu isOpen={false} />).contains(expectedRender)).toBe(true)
  })

  describe('when isOpen is true', () => {
    it('renders with the SideBarMenu__open class', () => {
      const expectedRender = (
        <div className='SideBarMenu SideBarMenu__open'>
          <div>I slide into view</div>
          <div>Me too!</div>
          <div>Meee Threeeee!</div>
        </div>
      )
      expect(shallow(<SideBarMenu isOpen />).contains(expectedRender)).toBe(true)
    })
  })
})

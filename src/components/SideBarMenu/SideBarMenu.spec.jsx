import React from 'react'
import SideBarMenu from './SideBarMenu'
import SideBarMenuItem from '../SideBarMenuItem/SideBarMenuItem'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('SideBarMenu.jsx', () => {
  it('renders without crashing', () => {
    const expectedRender = (
      <div className='SideBarMenu'>
        <SideBarMenuItem key={0} href='http://opentrv.org.uk/what-is-opentrv/' text='About OpenTRV' />
        <SideBarMenuItem key={1} href='http://opentrv.org.uk/principles/' text='OpenTRV principles' />
        <SideBarMenuItem key={2} href='https://twitter.com/OpenTRV' text='OpenTRV Twitter' />
        <SideBarMenuItem key={3} href='http://opentrv.org.uk/documents/' text='TRV documentation' />
        <SideBarMenuItem key={4} href='https://github.com/jack-evans/opentrv-webui/issues' text='Report an Issue' />
      </div>
    )
    expect(shallow(<SideBarMenu isOpen={false} />).contains(expectedRender)).toBe(true)
  })

  describe('when isOpen is true', () => {
    it('renders with the SideBarMenu__open class', () => {
      const expectedRender = (
        <div className='SideBarMenu SideBarMenu__open'>
          <SideBarMenuItem key={0} href='http://opentrv.org.uk/what-is-opentrv/' text='About OpenTRV' />
          <SideBarMenuItem key={1} href='http://opentrv.org.uk/principles/' text='OpenTRV principles' />
          <SideBarMenuItem key={2} href='https://twitter.com/OpenTRV' text='OpenTRV Twitter' />
          <SideBarMenuItem key={3} href='http://opentrv.org.uk/documents/' text='TRV documentation' />
          <SideBarMenuItem key={4} href='https://github.com/jack-evans/opentrv-webui/issues' text='Report an Issue' />
        </div>
      )
      expect(shallow(<SideBarMenu isOpen />).contains(expectedRender)).toBe(true)
    })
  })
})

import React from 'react'
import MainContent from './MainContent'
import { setAuthenticated } from '../../utils/auth'
import { MemoryRouter } from 'react-router-dom'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('MainContent.jsx', () => {
  it('renders without crashing', () => {
    expect(JSON.stringify(
      Object.assign({}, MainContent, { _reactInternalInstance: 'censored' })
    )).toMatchSnapshot()
  })

  describe('when the inital entry is "/"', () => {
    it('loads the Welcome page', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/']}>
          <MainContent />
        </MemoryRouter>
      )
      expect(wrapper.find('.Welcome')).toHaveLength(1)
    })
  })

  describe('when the inital entry is "/login"', () => {
    it('loads the Login page', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/login']}>
          <MainContent />
        </MemoryRouter>
      )
      expect(wrapper.find('.Login')).toHaveLength(1)
    })
  })

  // not ready for this test
  describe.skip('when the inital entry is "/register"', () => {
    it('loads the Register page', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/register']}>
          <MainContent />
        </MemoryRouter>
      )
      expect(wrapper.find('.Register')).toHaveLength(1)
    })
  })

  describe('when the initial entry is "/overview"', () => {
    let wrapper

    beforeEach(() => {
      setAuthenticated(true)
      wrapper = mount(
        <MemoryRouter initialEntries={['/overview']}>
          <MainContent />
        </MemoryRouter>
      )
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('loads the Overview page', () => {
      expect(wrapper.find('.Overview')).toHaveLength(1)
    })

    it('renders the Header component', () => {
      expect(wrapper.find('.Header')).toHaveLength(1)
    })

    it('renders the SideBarMenu', () => {
      expect(wrapper.find('.SideBarMenu')).toHaveLength(1)
    })

    describe.skip('when the menu button is clicked', () => {
      it('changes the state of sideBarMenuOpen', () => {
        const mainContent = wrapper.find('MainContent')
        console.log(mainContent.instance())
        // expect(mainContent.state().sideBarMenuOpen).toBe(false)
        wrapper.find('Header').simulate('click')
        expect(wrapper.state().sideBarMenuOpen).toBe(true)
      })

      describe('multiple times', () => {
        it('changes the state of sideBarMenuOpen', () => {
          expect(wrapper.state().sideBarMenuOpen).toBe(false)
          wrapper.find('Header').simulate('click')
          expect(wrapper.state().sideBarMenuOpen).toBe(true)
          wrapper.find('Header').simulate('click')
          expect(wrapper.state().sideBarMenuOpen).toBe(false)
          wrapper.find('Header').simulate('click')
          expect(wrapper.state().sideBarMenuOpen).toBe(true)
        })
      })
    })
  })

  describe('when the initial entry begins with "/devices"', () => {
    let wrapper

    beforeEach(() => {
      setAuthenticated(true)
      wrapper = mount(
        <MemoryRouter initialEntries={['/devices/1234']}>
          <MainContent />
        </MemoryRouter>
      )
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('loads the DevicePanel page', () => {
      expect(wrapper.find('DevicePanel')).toHaveLength(1)
    })

    it('renders the Header component', () => {
      expect(wrapper.find('.Header')).toHaveLength(1)
    })

    it('renders the SideBarMenu', () => {
      expect(wrapper.find('.SideBarMenu')).toHaveLength(1)
    })
  })

  describe('when the inital entry is "/random"', () => {
    it('loads the NotFound page', () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={['/random']}>
          <MainContent />
        </MemoryRouter>
      )
      expect(wrapper.find('.NotFound')).toHaveLength(1)
    })
  })
})

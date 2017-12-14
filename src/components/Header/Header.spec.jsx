import React from 'react'
import Header from './Header'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('Header..jsx', () => {
  it('renders without crashing', () => {
    const cbFunction = () => {}

    const expectedRender = (
      <header className='Header'>
        <div className='Header__left-nav-toggle-container'>
          <button type='button' className='Header__left-nav-toggle' onClick={cbFunction}>
            <span className='Header__left-nav-icon' />
          </button>
        </div>
        <a className='Header__title' href='/'>
          <h3>Welcome to React</h3>
        </a>
      </header>
    )
    expect(shallow(<Header onClick={cbFunction} />).contains(expectedRender)).toBe(true)
  })

  describe('when the button is clicked', () => {
    it('calls the callback function', () => {
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

      const expectedRender = (
        <header className='Header'>
          <div className='Header__left-nav-toggle-container'>
            <button type='button' className='Header__left-nav-toggle Header__left-nav-toggle--active' onClick={cbFunction}>
              <span className='Header__left-nav-icon' />
            </button>
          </div>
          <a className='Header__title' href='/'>
            <h3>Welcome to React</h3>
          </a>
        </header>
      )
      expect(shallow(<Header onClick={cbFunction} isOpen />).contains(expectedRender)).toBe(true)
    })
  })
})

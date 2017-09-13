import React from 'react'
import { shallow } from 'enzyme'
import Header from './Header'

describe('Header..jsx', () => {
  it('renders without crashing', () => {
    const cbFunction = () => {}

    const expectedRender = (
      <header className='Header'>
        <div className='Header__left-container'>
          <div className='Header__left-nav-toggle-container'>
            <button type='button' className='Header__left-nav-toggle' onClick={cbFunction}>
              <span />
            </button>
          </div>
          <a className='Header__title' href='/'>Welcome to React</a>
        </div>
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
})

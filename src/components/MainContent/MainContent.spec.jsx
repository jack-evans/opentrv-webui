import React from 'react'
import { shallow } from 'enzyme'
import MainContent from './MainContent'

describe('MainContent.jsx', () => {
  it('renders without crashing', () => {
    const expectedRender = (
      <div className='MainContent'>
        <p>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    )
    expect(shallow(<MainContent />).contains(expectedRender)).toBe(true)
  })
})

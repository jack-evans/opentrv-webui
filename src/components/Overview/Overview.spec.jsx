import React from 'react'
import { shallow } from 'enzyme'
import Overview from './Overview'

describe('Overview.jsx', () => {
  it('renders without crashing', () => {
    const expectedRender = (
      <div>
        <p>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    )

    expect(shallow(<Overview />).contains(expectedRender)).toBe(true)
  })
})

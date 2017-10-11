import React from 'react'
import { shallow } from 'enzyme'
import AnotherDisplay from './AnotherDisplay'

describe('AnotherDisplay.jsx', () => {
  it('renders wthout crashing', () => {
    const expectedRender = (
      <div>
        <p>
          I'm another display panel
        </p>
      </div>
    )

    expect(shallow(<AnotherDisplay />).contains(expectedRender)).toBe(true)
  })
})

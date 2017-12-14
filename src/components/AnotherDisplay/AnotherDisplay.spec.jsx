import React from 'react'
import AnotherDisplay from './AnotherDisplay'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

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

import React from 'react'
import AnotherDisplay from './DevicePanel'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('AnotherDisplay.jsx', () => {
  it('renders wthout crashing', () => {
    const expectedRender = (
      <div>
        <p>
          I'm another display panel for display: {'1234'}
        </p>
      </div>
    )

    const match = {
      params: {
        id: '1234'
      }
    }

    expect(shallow(<AnotherDisplay match={match} />).contains(expectedRender)).toBe(true)
  })
})

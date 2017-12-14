import React from 'react'
import Overview from './Overview'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

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

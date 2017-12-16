import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import OverviewHeader from './OverviewHeader'

Enzyme.configure({ adapter: new Adapter() })

describe('Overview.jsx', () => {
  it('renders without crashing', () => {
    const expectedRender = (
      <div className='OverviewHeader'>
        <h1>Device Overview</h1>
      </div>
    )

    expect(shallow(<OverviewHeader />).contains(expectedRender)).toBe(true)
  })
})

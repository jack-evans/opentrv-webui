import React from 'react'
import Overview from './Overview'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import OverviewHeader from '../OverviewHeader/OverviewHeader'

Enzyme.configure({ adapter: new Adapter() })

describe('Overview.jsx', () => {
  it('renders without crashing', () => {
    const expectedRender = (
      <div className='Overview'>
        <OverviewHeader />
      </div>
    )

    expect(shallow(<Overview />).contains(expectedRender)).toBe(true)
  })
})

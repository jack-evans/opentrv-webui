import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import OverviewHeader from './OverviewHeader'

Enzyme.configure({ adapter: new Adapter() })

describe('Overview.jsx', () => {
  it('renders without crashing', () => {
    expect(shallow(<OverviewHeader />)).toMatchSnapshot()
  })
})

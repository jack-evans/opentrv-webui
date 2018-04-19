import React from 'react'
import NotFound from './NotFound'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('NotFound.jsx', () => {
  it('renders without crashing', () => {
    expect(shallow(<NotFound />)).toMatchSnapshot()
  })
})

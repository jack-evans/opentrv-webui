import React from 'react'
import PrivateRoute from './PrivateRoute'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('PrivateRoute.jsx', () => {
  const TestComponenent = () => (
    <div>
      test
    </div>
  )

  it('renders without crashing', () => {
    expect(shallow(<PrivateRoute path='/test' component={TestComponenent} />))
  })
})

import React from 'react'
import PrivateRoute from './PrivateRoute'
import { MemoryRouter } from 'react-router-dom'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { isAuthenticated } from '../../utils/auth'
jest.mock('../../utils/auth')

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

  describe('when isAuthenticated returns true', () => {
    beforeEach(() => {
      isAuthenticated.mockReturnValue(true)
    })

    it('returns the component', () => {
      const wrapper = mount(
        <MemoryRouter>
          <PrivateRoute path='/test' component={TestComponenent} />
        </MemoryRouter>
      )
      let component = wrapper.find('Route').props().render()
      component = component.type()
      expect(component.props.children).toEqual('test')
    })
  })

  describe('when isAuthenticated returns false', () => {
    beforeEach(() => {
      isAuthenticated.mockReturnValue(false)
    })

    it('redirects to "/"', () => {
      const wrapper = mount(
        <MemoryRouter>
          <PrivateRoute path='/test' component={TestComponenent} />
        </MemoryRouter>
      )
      let component = wrapper.find('Route').props().render()
      expect(component.props.to).toEqual('/')
    })
  })
})

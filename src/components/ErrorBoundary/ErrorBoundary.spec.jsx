import React from 'react'
import ErrorBoundary from './ErrorBoundary'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('ErrorBoundary.jsx', () => {
  it('renders without crashing', () => {
    expect(shallow(<ErrorBoundary />)).toMatchSnapshot()
  })

  describe('when the hasError state is true', () => {
    it('renders the general error content', () => {
      const wrapper = mount(
        <ErrorBoundary>
          <p>I'm a test</p>
        </ErrorBoundary>
      )
      wrapper.setState({hasError: true})

      expect(wrapper.find('h1')).toHaveLength(1)
    })
  })

  describe('when the hasError state is false', () => {
    it('renders the child node', () => {
      const wrapper = mount(
        <ErrorBoundary>
          <p>I'm a test</p>
        </ErrorBoundary>
      )
      wrapper.setState({hasError: false})

      expect(wrapper.find('p')).toHaveLength(1)
    })
  })
})

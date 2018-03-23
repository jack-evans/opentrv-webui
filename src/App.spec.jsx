import App from './App'

describe('App.jsx', () => {
  'use strict'

  it('renders without crashing', () => {
    expect(JSON.stringify(
      Object.assign({}, App, { _reactInternalInstance: 'censored' })
    )).toMatchSnapshot()
  })
})

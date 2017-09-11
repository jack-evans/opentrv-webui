import Index from './index'

describe('index.jsx', () => {
  'use strict'

  it('renders without crashing', () => {
    expect(JSON.stringify(
      Object.assign({}, Index, { _reactInternalInstance: 'censored' })
    )).toMatchSnapshot()
  })
})

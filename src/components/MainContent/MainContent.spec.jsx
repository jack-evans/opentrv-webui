import MainContent from './MainContent'

describe('MainContent.jsx', () => {
  it('renders without crashing', () => {
    expect(JSON.stringify(
      Object.assign({}, MainContent, { _reactInternalInstance: 'censored' })
    )).toMatchSnapshot()
  })
})

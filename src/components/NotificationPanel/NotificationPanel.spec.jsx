import React from 'react'
import NotificationPanel from './NotificationPanel'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('NotificationPanel.jsx', () => {
  describe('when notifications is an empty array', () => {
    it('renders without crashing', () => {
      expect(shallow(<NotificationPanel notifications={[]} />)).toMatchSnapshot()
    })

    it('renders 0 ToastNotifications', () => {
      const wrapper = mount(<NotificationPanel notifications={[]} />)
      expect(wrapper.find('.bx--toast-notification')).toHaveLength(0)
    })
  })

  describe('when notifications is a populated array', () => {
    const notifications = [
      {
        title: 'test 1',
        subtitle: 'subtitle test 1',
        timeStamp: '1234',
        kind: 'success'
      }, {
        title: 'test 2',
        subtitle: 'subtitle test 2',
        timeStamp: '5678',
        kind: 'success'
      }
    ]

    it('renders without crashing', () => {
      expect(shallow(<NotificationPanel notifications={notifications} />)).toMatchSnapshot()
    })

    it('renders 2 ToastNotifications', () => {
      const wrapper = mount(<NotificationPanel notifications={notifications} />)
      expect(wrapper.find('.bx--toast-notification')).toHaveLength(2)
    })
  })

  describe('when an object in the notifications array doesnt contain the kind property', () => {
    const notifications = [
      {
        title: 'test 1',
        subtitle: 'subtitle test 1',
        timeStamp: '1234'
      }
    ]

    it('defaults to the "error" type of notification', () => {
      const wrapper = mount(<NotificationPanel notifications={notifications} />)
      expect(wrapper.find('.bx--toast-notification--error')).toHaveLength(1)
    })
  })
})

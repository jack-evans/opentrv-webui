import React from 'react'
import { ToastNotification } from 'carbon-components-react'

const NotificationPanel = ({ notifications }) => {
  let content
  if (notifications.length > 0) {
    content = notifications.map((notification, index) => {
      return (
        <ToastNotification
          key={index}
          title={notification.title}
          subtitle={notification.subtitle}
          caption={'Time stamp: ' + notification.timeStamp}
          kind={notification.kind || 'error'}
        />
      )
    })
  }

  return (
    <div className='NotificationPanel'>
      {content}
    </div>
  )
}

export default NotificationPanel

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { allNotificationsRead, selectAllNotifications } from "./notificationsSlice"
import { selectAllUsers } from "../users/usersSlice"
import { parseISO, formatDistanceToNow } from "date-fns"
import classnames from 'classnames'

export const NotificationsList = () => {
  const dispatch = useDispatch()
  const notifications = useSelector(selectAllNotifications)
  const users = useSelector(selectAllUsers)

  // useEffect hook is used to handle side effect
  // side effect:
  // affect something outside of current function
  useEffect(() => {
    // turn all notifications' state into 'read'
    dispatch(allNotificationsRead())
  })
  // ⬆ dispatch allNotificationsRead action every time after
  // this component, NotificationsList, is rendered

  const renderedNotifications = notifications.map(notification => {
    const date = parseISO(notification.date)
    const timeAgo = formatDistanceToNow(date)
    const user = users.find(user => user.id === notification.user) || {
      name: 'Unknown User'
    }
    const notificationClassName = classnames('notification', {
      new: notification.isNew
    })
    
    return (
      <div key={notification.id} className={notificationClassName}>
        <div>
          <b>{user.name}</b> {notification.message}
        </div>
        <div title={notification.date}>
          <i>{timeAgo} ago</i>
        </div>
      </div>
    )
  })

  return (
    <section className="notificationList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  )
}
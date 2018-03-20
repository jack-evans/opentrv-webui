import React from 'react'
import { Route, Redirect } from 'react-router-dom'

const isAuthenticated = false

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={(props) => (
      isAuthenticated === true ? <Component {...props} /> : <Redirect to='/' />
    )} />
  )
}

export default PrivateRoute

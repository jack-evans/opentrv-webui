import makeRequest from './makeRequest'
import decode from 'jwt-decode'

export function isAuthenticated () {
  const token = getToken()
  if (!token) {
    return false
  } else {
    const decodedToken = decode(token)
    const date = new Date(0)
    date.setUTCSeconds(decodedToken.exp)
    if (date < new Date()) {
      return false
    } else {
      return true
    }
  }
}

export function loginUser (user) {
  let url = '/api/v1/user/login'
  let options = {
    method: 'POST',
    json: true,
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(user)
  }

  return makeRequest(url, options)
    .then(res => {
      setToken(res.token)
      return Promise.resolve()
    })
}

export function setToken (token) {
  window.localStorage.setItem('token', token)
}

export function getToken () {
  return window.localStorage.getItem('token')
}

export function logout () {
  window.localStorage.removeItem('token')
}

import makeRequest from './makeRequest'

let authenticated = false

export function isAuthenticated () {
  return authenticated
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

/**
 * Test helper
 * @param {boolean} val - the value to set authenticated to
 */
export function setAuthenticated (val) {
  authenticated = val
}

let authenticated = false

export function isAuthenticated () {
  return authenticated
}

export function loginUser (user) {
  if (user.email === 'john.doe@example.com') {
    authenticated = true
  } else {
    authenticated = false
  }
  return authenticated
}

/**
 * Test helper
 * @param {boolean} val - the value to set authenticated to
 */
export function setAuthenticated (val) {
  authenticated = val
}

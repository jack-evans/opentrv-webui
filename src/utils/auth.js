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

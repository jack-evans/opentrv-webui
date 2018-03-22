import { isAuthenticated, loginUser } from './auth'

describe('auth.js', () => {
  describe('isAuthenticated', () => {
    it('returns the boolean value of authenticated', () => {
      expect(isAuthenticated()).toEqual(false)
    })
  })

  describe('loginUser', () => {
    describe('when the user email is "john.doe@example.com"', () => {
      it('sets authenticated to true and returns true', () => {
        expect(loginUser({email: 'john.doe@example.com', pass: 'pass'})).toEqual(true)
      })
    })

    describe('when the user email is not "john.doe@example.com"', () => {
      it('sets authenticated to false and returns false', () => {
        expect(loginUser({email: 'bad.email@example.com', pass: 'pass'})).toEqual(false)
      })
    })
  })
})

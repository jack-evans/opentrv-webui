import { isAuthenticated, loginUser } from './auth'
import makeRequest from './makeRequest'
import 'jest-localstorage-mock'
jest.mock('./makeRequest.js')

describe('auth.js', () => {
  describe('isAuthenticated', () => {
    it('returns the boolean value of authenticated', () => {
      expect(isAuthenticated()).toEqual(false)
    })
  })

  describe('loginUser', () => {
    beforeEach(() => {
      makeRequest.mockReturnValue(Promise.resolve({token: 'fakeToken'}))
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('calls makeRequest', () => {
      return loginUser({email: 'john.doe@example.com', password: 'pass'})
        .then(() => {
          expect(makeRequest).toHaveBeenCalledTimes(1)
        })
    })

    describe('when makeRequest is successful', () => {
      it('calls setToken', () => {
        return loginUser({email: 'john.doe@example.com', password: 'pass'})
          .then(() => {
            expect(window.localStorage.setItem).toHaveBeenCalledTimes(1)
          })
      })

      it('calls setToken with the token', () => {
        return loginUser({email: 'john.doe@example.com', password: 'pass'})
          .then(() => {
            expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'fakeToken')
          })
      })
    })

    describe('when makeRequest fails', () => {
      it('does not call setToken', () => {
        makeRequest.mockReturnValue(Promise.reject(new Error('Bang')))

        return loginUser({email: 'bad.email@example.com', password: 'pass'})
          .catch(() => {
            expect(window.localStorage.setItem).toHaveBeenCalledTimes(0)
          })
      })

      it('returns the error', () => {
        makeRequest.mockReturnValue(Promise.reject(new Error('Bang')))

        return loginUser({email: 'bad.email@example.com', password: 'pass'})
          .catch(error => {
            expect(error.message).toEqual('Bang')
          })
      })
    })
  })
})

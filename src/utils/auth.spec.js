import { isAuthenticated, loginUser, logout } from './auth'
import makeRequest from './makeRequest'
import decode from 'jwt-decode'
import 'jest-localstorage-mock'
jest.mock('./makeRequest.js')
jest.mock('jwt-decode')

describe('auth.js', () => {
  describe('isAuthenticated', () => {
    beforeEach(() => {
      window.localStorage.clear()
    })

    it('calls window.localStorage.getItem', () => {
      isAuthenticated()
      expect(window.localStorage.getItem).toHaveBeenCalledTimes(1)
    })

    describe('when there isnt a token stored in localStorage', () => {
      it('returns false', () => {
        expect(isAuthenticated()).toEqual(false)
      })
    })

    describe('when there is a token stored in localStorage', () => {
      beforeEach(() => {
        window.localStorage.getItem.mockReturnValue('fakeJwtToken')
        decode.mockReturnValue({exp: 0})
      })

      it('calls decode', () => {
        isAuthenticated()
        expect(decode).toHaveBeenCalledTimes(1)
      })

      it('calls decode with the token', () => {
        isAuthenticated()
        expect(decode).toHaveBeenCalledWith('fakeJwtToken')
      })

      describe('when the token has expired', () => {
        beforeEach(() => {
          decode.mockReturnValue({exp: 0})
        })

        it('returns false', () => {
          expect(isAuthenticated()).toEqual(false)
        })
      })

      describe('when the token is in date', () => {
        beforeEach(() => {
          decode.mockReturnValue({exp: (new Date() * 1000)})
        })

        it('returns true', () => {
          expect(isAuthenticated()).toEqual(true)
        })
      })
    })
  })

  describe('loginUser', () => {
    beforeEach(() => {
      window.localStorage.clear()
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
      it('calls window.localStorage.setItem', () => {
        return loginUser({email: 'john.doe@example.com', password: 'pass'})
          .then(() => {
            expect(window.localStorage.setItem).toHaveBeenCalledTimes(1)
          })
      })

      it('calls window.localStorage.setItem with the token', () => {
        return loginUser({email: 'john.doe@example.com', password: 'pass'})
          .then(() => {
            expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'fakeToken')
          })
      })
    })

    describe('when makeRequest fails', () => {
      it('does not call window.localStorage.setItem', () => {
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

  describe('logout', () => {
    beforeEach(() => {
      window.localStorage.clear()
      window.localStorage.setItem('token', 'fakeToken')
    })

    it('calls window.localStorage.removeItem', () => {
      logout()
      expect(window.localStorage.removeItem).toHaveBeenCalledTimes(1)
    })

    it('removes the token from localStorage', () => {
      logout()
      expect(window.localStorage.length).toBe(0)
    })
  })
})

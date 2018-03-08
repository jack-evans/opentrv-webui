import toBeType from 'jest-tobetype'

const httpMocks = require('node-mocks-http')
const Promise = require('bluebird')
expect.extend(toBeType)

describe('user.js', () => {
  let userService

  beforeEach(() => {
    userService = require('../../lib/userService/user')
  })

  afterEach(() => {
    delete require.cache[require.resolve('../../lib/userService/user')]
  })

  describe('createUserRequestHandler', () => {
    let createUserSpy
    let req
    let res

    beforeEach(() => {
      createUserSpy = jest.spyOn(userService.internal, '_createUser')
      req = httpMocks.createRequest({
        method: 'POST',
        path: '/user',
        body: {
          email: 'john.doe@example.com',
          name: 'John Doe'
        },
        userDb: {}
      })
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
    })

    afterEach(() => {
      createUserSpy.mockReset()
    })

    it('calls the createUser internal function', (done) => {
      createUserSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(createUserSpy).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      userService.createUserRequestHandler(req, res)
    })

    it('calls the createUser internal function with the database and the body of the request', (done) => {
      createUserSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(createUserSpy).toHaveBeenCalledWith(req.userDb, req.body)
          done()
        } catch (e) {
          done(e)
        }
      })

      userService.createUserRequestHandler(req, res)
    })

    describe('when the createUser internal function succeeds', () => {
      it('returns 201', (done) => {
        createUserSpy.mockReturnValue(Promise.resolve())

        res.on('end', () => {
          try {
            expect(res._getStatusCode()).toEqual(201)
            done()
          } catch (e) {
            done(e)
          }
        })

        userService.createUserRequestHandler(req, res)
      })
    })

    describe('when the createUser internal function fails', () => {
      describe('with a 400', () => {
        it('returns a 400', (done) => {
          const error = {
            statusCode: 400,
            message: 'bad request'
          }
          createUserSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(400)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.createUserRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            statusCode: 400,
            message: 'bad request'
          }
          createUserSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.createUserRequestHandler(req, res)
        })
      })

      describe('with a 409', () => {
        it('returns a 409', (done) => {
          const error = {
            statusCode: 409,
            message: 'conflict'
          }
          createUserSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(409)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.createUserRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            statusCode: 409,
            message: 'conflict'
          }
          createUserSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.createUserRequestHandler(req, res)
        })
      })

      describe('with a 500', () => {
        it('returns a 500', (done) => {
          const error = {
            statusCode: 500,
            message: 'internal server error'
          }
          createUserSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(500)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.createUserRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            statusCode: 500,
            message: 'internal server error'
          }
          createUserSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.createUserRequestHandler(req, res)
        })
      })
    })
  })

  describe('getUserRequestHandler', () => {
    const fakeUserDoc = {
      name: 'John Doe',
      email: 'john.doe@example.com'
    }
    let getUserSpy
    let req
    let res

    beforeEach(() => {
      getUserSpy = jest.spyOn(userService.internal, '_getUser')
      req = httpMocks.createRequest({
        method: 'GET',
        path: '/user',
        params: {
          id: '1234'
        },
        userDb: {}
      })
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
    })

    afterEach(() => {
      getUserSpy.mockReset()
    })

    it('calls the getUser internal function', (done) => {
      getUserSpy.mockReturnValue(Promise.resolve(fakeUserDoc))

      res.on('end', () => {
        try {
          expect(getUserSpy).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      userService.getUserRequestHandler(req, res)
    })

    it('calls the getUser internal function with the database and the body of the request', (done) => {
      getUserSpy.mockReturnValue(Promise.resolve(fakeUserDoc))

      res.on('end', () => {
        try {
          expect(getUserSpy).toHaveBeenCalledWith(req.userDb, req.params.id)
          done()
        } catch (e) {
          done(e)
        }
      })

      userService.getUserRequestHandler(req, res)
    })

    describe('when the getUser internal function succeeds', () => {
      it('returns 200', (done) => {
        getUserSpy.mockReturnValue(Promise.resolve(fakeUserDoc))

        res.on('end', () => {
          try {
            expect(res._getStatusCode()).toEqual(200)
            done()
          } catch (e) {
            done(e)
          }
        })

        userService.getUserRequestHandler(req, res)
      })

      it('returns the user information in the body', (done) => {
        getUserSpy.mockReturnValue(Promise.resolve(fakeUserDoc))

        res.on('end', () => {
          try {
            expect(res._getData()).toBe(fakeUserDoc)
            done()
          } catch (e) {
            done(e)
          }
        })

        userService.getUserRequestHandler(req, res)
      })
    })

    describe('when the getUser internal function fails', () => {
      describe('with a 400', () => {
        it('returns a 400', (done) => {
          const error = {
            statusCode: 400,
            message: 'bad request'
          }
          getUserSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(400)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.getUserRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            statusCode: 400,
            message: 'bad request'
          }
          getUserSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.getUserRequestHandler(req, res)
        })
      })

      describe('with a 404', () => {
        it('returns a 404', (done) => {
          const error = {
            statusCode: 404,
            message: 'not found'
          }
          getUserSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(404)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.getUserRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            statusCode: 404,
            message: 'not found'
          }
          getUserSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.getUserRequestHandler(req, res)
        })
      })

      describe('with a 500', () => {
        it('returns a 500', (done) => {
          const error = {
            statusCode: 500,
            message: 'internal server error'
          }
          getUserSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(500)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.getUserRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            statusCode: 500,
            message: 'internal server error'
          }
          getUserSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.getUserRequestHandler(req, res)
        })
      })
    })
  })

  describe('updateUserRequestHandler', () => {
    let updateUserSpy
    let req
    let res

    beforeEach(() => {
      updateUserSpy = jest.spyOn(userService.internal, '_updateUser')
      req = httpMocks.createRequest({
        method: 'PUT',
        path: '/user',
        params: {
          id: '1234'
        },
        body: {
          email: 'john.doe@example.com',
          name: 'John Doe',
          address: {
            number: '1234',
            road: 'example street'
          }
        },
        userDb: {}
      })
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
    })

    afterEach(() => {
      updateUserSpy.mockReset()
    })

    it('calls the updateUser internal function', (done) => {
      updateUserSpy.mockReturnValue(Promise.resolve(req.body))

      res.on('end', () => {
        try {
          expect(updateUserSpy).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      userService.updateUserRequestHandler(req, res)
    })

    it('calls the updateUser internal function with the database and the body of the request', (done) => {
      updateUserSpy.mockReturnValue(Promise.resolve(req.body))

      res.on('end', () => {
        try {
          expect(updateUserSpy).toHaveBeenCalledWith(req.userDb, req.body)
          done()
        } catch (e) {
          done(e)
        }
      })

      userService.updateUserRequestHandler(req, res)
    })

    describe('when the updateUser internal function succeeds', () => {
      it('returns 200', (done) => {
        updateUserSpy.mockReturnValue(Promise.resolve(req.body))

        res.on('end', () => {
          try {
            expect(res._getStatusCode()).toEqual(200)
            done()
          } catch (e) {
            done(e)
          }
        })

        userService.updateUserRequestHandler(req, res)
      })

      it('returns the new user document', (done) => {
        updateUserSpy.mockReturnValue(Promise.resolve(req.body))

        res.on('end', () => {
          try {
            expect(res._getData()).toBe(req.body)
            done()
          } catch (e) {
            done(e)
          }
        })

        userService.updateUserRequestHandler(req, res)
      })
    })

    describe('when the updateUser internal function fails', () => {
      describe('with a 400', () => {
        it('returns a 400', (done) => {
          const error = {
            statusCode: 400,
            message: 'bad request'
          }
          updateUserSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(400)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.updateUserRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            statusCode: 400,
            message: 'bad request'
          }
          updateUserSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.updateUserRequestHandler(req, res)
        })
      })

      describe('with a 404', () => {
        it('returns a 404', (done) => {
          const error = {
            statusCode: 404,
            message: 'not found'
          }
          updateUserSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(404)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.updateUserRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            statusCode: 404,
            message: 'not found'
          }
          updateUserSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.updateUserRequestHandler(req, res)
        })
      })

      describe('with a 409', () => {
        it('returns a 409', (done) => {
          const error = {
            statusCode: 409,
            message: 'conflict'
          }
          updateUserSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(409)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.updateUserRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            statusCode: 409,
            message: 'conflict'
          }
          updateUserSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.updateUserRequestHandler(req, res)
        })
      })

      describe('with a 500', () => {
        it('returns a 500', (done) => {
          const error = {
            statusCode: 500,
            message: 'internal server error'
          }
          updateUserSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(500)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.updateUserRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            statusCode: 500,
            message: 'internal server error'
          }
          updateUserSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.updateUserRequestHandler(req, res)
        })
      })
    })
  })

  describe('deleteUserRequestHandler', () => {
    let deleteUserSpy
    let req
    let res

    beforeEach(() => {
      deleteUserSpy = jest.spyOn(userService.internal, '_deleteUser')
      req = httpMocks.createRequest({
        method: 'DELETE',
        path: '/user',
        params: {
          id: '1234'
        },
        userDb: {}
      })
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
    })

    afterEach(() => {
      deleteUserSpy.mockReset()
    })

    it('calls the deleteUser internal function', (done) => {
      deleteUserSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(deleteUserSpy).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      userService.deleteUserRequestHandler(req, res)
    })

    it('calls the deleteUser internal function with the database and the body of the request', (done) => {
      deleteUserSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(deleteUserSpy).toHaveBeenCalledWith(req.userDb, req.params.id)
          done()
        } catch (e) {
          done(e)
        }
      })

      userService.deleteUserRequestHandler(req, res)
    })

    describe('when the deleteUser internal function succeeds', () => {
      it('returns 200', (done) => {
        deleteUserSpy.mockReturnValue(Promise.resolve())

        res.on('end', () => {
          try {
            expect(res._getStatusCode()).toEqual(204)
            done()
          } catch (e) {
            done(e)
          }
        })

        userService.deleteUserRequestHandler(req, res)
      })
    })

    describe('when the deleteUser internal function fails', () => {
      describe('with a 400', () => {
        it('returns a 400', (done) => {
          const error = {
            statusCode: 400,
            message: 'bad request'
          }
          deleteUserSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(400)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.deleteUserRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            statusCode: 400,
            message: 'bad request'
          }
          deleteUserSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.deleteUserRequestHandler(req, res)
        })
      })

      describe('with a 404', () => {
        it('returns a 404', (done) => {
          const error = {
            statusCode: 404,
            message: 'not found'
          }
          deleteUserSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(404)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.deleteUserRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            statusCode: 404,
            message: 'not found'
          }
          deleteUserSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.deleteUserRequestHandler(req, res)
        })
      })

      describe('with a 409', () => {
        it('returns a 409', (done) => {
          const error = {
            statusCode: 409,
            message: 'conflict'
          }
          deleteUserSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(409)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.deleteUserRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            statusCode: 409,
            message: 'conflict'
          }
          deleteUserSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.deleteUserRequestHandler(req, res)
        })
      })

      describe('with a 500', () => {
        it('returns a 500', (done) => {
          const error = {
            statusCode: 500,
            message: 'internal server error'
          }
          deleteUserSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(500)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.deleteUserRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            statusCode: 500,
            message: 'internal server error'
          }
          deleteUserSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.deleteUserRequestHandler(req, res)
        })
      })
    })
  })
})

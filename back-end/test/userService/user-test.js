import toBeType from 'jest-tobetype'

const bcrypt = require('bcrypt')
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

    afterAll(() => {
      createUserSpy.mockRestore()
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

      it('returns an empty object', (done) => {
        createUserSpy.mockReturnValue(Promise.resolve())

        res.on('end', () => {
          try {
            expect(res._getData()).toEqual({})
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

      describe('with any other kind of error', () => {
        it('returns a 500', (done) => {
          const error = {
            message: 'bang!'
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
            message: 'bang!'
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

    afterAll(() => {
      getUserSpy.mockRestore()
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

    afterAll(() => {
      updateUserSpy.mockRestore()
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

    afterAll(() => {
      deleteUserSpy.mockRestore()
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

  describe('internal functions', () => {
    describe('_createUser', () => {
      let fakeDatabase
      let createUserSpy
      let hashSpy
      const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'test',
        address: {
          firstLine: '123 example street',
          county: 'exampleCounty',
          postcode: 'ab12cd'
        }
      }

      beforeEach(() => {
        fakeDatabase = {
          createUser: () => {}
        }
        createUserSpy = jest.spyOn(fakeDatabase, 'createUser').mockReturnValue(Promise.resolve())
        hashSpy = jest.spyOn(bcrypt, 'hash').mockReturnValue(Promise.resolve('1a2b3c4d'))
      })

      afterEach(() => {
        createUserSpy.mockReset()
        createUserSpy.mockRestore()
        hashSpy.mockReset()
        hashSpy.mockRestore()
      })

      it('calls the hash function', () => {
        return userService.internal._createUser(fakeDatabase, user)
          .then(() => {
            expect(hashSpy).toHaveBeenCalledTimes(1)
          })
      })

      describe('when the hash function succeeds', () => {
        it('calls the createUser function', () => {
          return userService.internal._createUser(fakeDatabase, user)
            .then(() => {
              expect(createUserSpy).toHaveBeenCalledTimes(1)
            })
        })

        it('calls the createUser function with the user document containing the hashed password', () => {
          const expectedUserDoc = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: '1a2b3c4d',
            address: {
              firstLine: '123 example street',
              county: 'exampleCounty',
              postcode: 'ab12cd'
            }
          }
          return userService.internal._createUser(fakeDatabase, user)
            .then(() => {
              expect(createUserSpy).toHaveBeenCalledWith(expectedUserDoc)
            })
        })

        describe('when the createUser function succeeds', () => {
          it('returns a resolved promise', () => {
            return userService.internal._createUser(fakeDatabase, user)
          })
        })

        describe('when the createUser function fails', () => {
          it('returns a rejected promise with the error in the body', () => {
            createUserSpy.mockReturnValue(Promise.reject(new Error('Bang!')))
            expect.assertions(1)
            return userService.internal._createUser(fakeDatabase, user)
              .catch(error => {
                expect(error.message).toEqual('Bang!')
              })
          })
        })
      })

      describe('when the hash function fails', () => {
        beforeEach(() => {
          hashSpy.mockReturnValue(Promise.reject(new Error('Bang!')))
        })

        it('returns a rejected promise with the error in the body', () => {
          expect.assertions(1)
          return userService.internal._createUser(fakeDatabase, user)
            .catch(error => {
              expect(error.message).toEqual('Bang!')
            })
        })
      })
    })

    describe('_getUser', () => {
      let fakeDatabase
      let getUserSpy

      beforeEach(() => {
        fakeDatabase = {
          getUser: () => {}
        }
        getUserSpy = jest.spyOn(fakeDatabase, 'getUser')
      })

      afterEach(() => {
        getUserSpy.mockReset()
        getUserSpy.mockRestore()
      })

      describe('when the userId is undefined', () => {
        it('does not call the getUser database method', () => {
          expect.assertions(1)
          return userService.internal._getUser(fakeDatabase, undefined)
            .catch(() => {
              expect(getUserSpy).toHaveBeenCalledTimes(0)
            })
        })

        it('returns a rejected promise with an error', () => {
          const expectedError = {
            statusCode: 400,
            message: 'The id provided was undefined',
            name: 'bad request'
          }
          expect.assertions(1)
          return userService.internal._getUser(fakeDatabase, undefined)
            .catch(error => {
              expect(error).toEqual(expectedError)
            })
        })
      })

      describe('when the userId is not a string', () => {
        it('does not call the getUser database method', () => {
          expect.assertions(1)
          return userService.internal._getUser(fakeDatabase, 1234)
            .catch(() => {
              expect(getUserSpy).toHaveBeenCalledTimes(0)
            })
        })

        it('returns a rejected promise with an error', () => {
          const expectedError = {
            statusCode: 400,
            message: 'The id provided was not in string format',
            name: 'bad request'
          }
          expect.assertions(1)
          return userService.internal._getUser(fakeDatabase, 1234)
            .catch(error => {
              expect(error).toEqual(expectedError)
            })
        })
      })

      describe('when the userId does not match the regex', () => {
        it('does not call the getUser database method', () => {
          expect.assertions(1)
          return userService.internal._getUser(fakeDatabase, '1234')
            .catch(() => {
              expect(getUserSpy).toHaveBeenCalledTimes(0)
            })
        })

        it('returns a rejected promise with an error', () => {
          const expectedError = {
            statusCode: 400,
            message: 'Id did not match the following regex: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/',
            name: 'bad request'
          }
          expect.assertions(1)
          return userService.internal._getUser(fakeDatabase, '1234')
            .catch(error => {
              expect(error).toEqual(expectedError)
            })
        })
      })

      describe('the userId is valid', () => {
        let regexSpy

        beforeEach(() => {
          regexSpy = jest.spyOn(RegExp.prototype, 'test').mockReturnValue(true)
        })

        afterEach(() => {
          regexSpy.mockRestore()
        })

        it('calls the getUser database method', () => {
          getUserSpy.mockReturnValue(Promise.resolve())
          return userService.internal._getUser(fakeDatabase, '1234')
            .then(() => {
              expect(getUserSpy).toHaveBeenCalledTimes(1)
            })
        })

        describe('when the getUser database method succeeds', () => {
          const fakeUserDoc = {
            id: '1234',
            name: 'John Doe',
            email: 'john.doe@example.com',
            address: {
              number: 12,
              street: 'example street'
            }
          }

          it('returns a resolved promise with the user document', () => {
            getUserSpy.mockReturnValue(Promise.resolve(fakeUserDoc))
            return userService.internal._getUser(fakeDatabase, '1234')
              .then(userDoc => {
                expect(userDoc).toEqual(fakeUserDoc)
              })
          })
        })

        describe('when the getUser database method fails', () => {
          it('returns a rejected promise with the error in the body', () => {
            expect.assertions(1)
            getUserSpy.mockReturnValue(Promise.reject(new Error('Bang!')))
            return userService.internal._getUser(fakeDatabase, '1234')
              .catch(error => {
                expect(error.message).toEqual('Bang!')
              })
          })
        })
      })
    })

    describe('_deleteUser', () => {
      let fakeDatabase
      let deleteUserSpy

      beforeEach(() => {
        fakeDatabase = {
          deleteUser: () => {}
        }
        deleteUserSpy = jest.spyOn(fakeDatabase, 'deleteUser')
      })

      afterEach(() => {
        deleteUserSpy.mockReset()
        deleteUserSpy.mockRestore()
      })

      describe('when the userId is undefined', () => {
        it('does not call the deleteUser database method', () => {
          expect.assertions(1)
          return userService.internal._deleteUser(fakeDatabase, undefined)
            .catch(() => {
              expect(deleteUserSpy).toHaveBeenCalledTimes(0)
            })
        })

        it('returns a rejected promise with an error', () => {
          const expectedError = {
            statusCode: 400,
            message: 'The id provided was undefined',
            name: 'bad request'
          }
          expect.assertions(1)
          return userService.internal._deleteUser(fakeDatabase, undefined)
            .catch(error => {
              expect(error).toEqual(expectedError)
            })
        })
      })

      describe('when the userId is not a string', () => {
        it('does not call the deleteUser database method', () => {
          expect.assertions(1)
          return userService.internal._deleteUser(fakeDatabase, 1234)
            .catch(() => {
              expect(deleteUserSpy).toHaveBeenCalledTimes(0)
            })
        })

        it('returns a rejected promise with an error', () => {
          const expectedError = {
            statusCode: 400,
            message: 'The id provided was not in string format',
            name: 'bad request'
          }
          expect.assertions(1)
          return userService.internal._deleteUser(fakeDatabase, 1234)
            .catch(error => {
              expect(error).toEqual(expectedError)
            })
        })
      })

      describe('when the userId does not match the regex', () => {
        it('does not call the deleteUser database method', () => {
          expect.assertions(1)
          return userService.internal._deleteUser(fakeDatabase, '1234')
            .catch(() => {
              expect(deleteUserSpy).toHaveBeenCalledTimes(0)
            })
        })

        it('returns a rejected promise with an error', () => {
          const expectedError = {
            statusCode: 400,
            message: 'Id did not match the following regex: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/',
            name: 'bad request'
          }
          expect.assertions(1)
          return userService.internal._deleteUser(fakeDatabase, '1234')
            .catch(error => {
              expect(error).toEqual(expectedError)
            })
        })
      })

      describe('the userId is valid', () => {
        let regexSpy

        beforeEach(() => {
          regexSpy = jest.spyOn(RegExp.prototype, 'test').mockReturnValue(true)
        })

        afterEach(() => {
          regexSpy.mockRestore()
        })

        it('calls the deleteUser database method', () => {
          deleteUserSpy.mockReturnValue(Promise.resolve())
          return userService.internal._deleteUser(fakeDatabase, '1234')
            .then(() => {
              expect(deleteUserSpy).toHaveBeenCalledTimes(1)
            })
        })

        describe('when the deleteUser database method succeeds', () => {
          it('returns a resolved promise', () => {
            deleteUserSpy.mockReturnValue(Promise.resolve())
            return userService.internal._deleteUser(fakeDatabase, '1234')
          })
        })

        describe('when the deleteUser database method fails', () => {
          it('returns a rejected promise with the error in the body', () => {
            expect.assertions(1)
            deleteUserSpy.mockReturnValue(Promise.reject(new Error('Bang!')))
            return userService.internal._deleteUser(fakeDatabase, '1234')
              .catch(error => {
                expect(error.message).toEqual('Bang!')
              })
          })
        })
      })
    })
  })
})

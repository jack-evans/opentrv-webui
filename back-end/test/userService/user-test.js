import toBeType from 'jest-tobetype'

const bcrypt = require('bcrypt')
const fs = require('fs')
const httpMocks = require('node-mocks-http')
const jwt = require('jsonwebtoken')
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
    let getUserByEmailSpy
    let req
    let res

    beforeEach(() => {
      createUserSpy = jest.spyOn(userService.internal, '_createUser')
      getUserByEmailSpy = jest.spyOn(userService.internal, '_getUserByEmail')
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
      getUserByEmailSpy.mockReset()
    })

    afterAll(() => {
      createUserSpy.mockRestore()
      getUserByEmailSpy.mockRestore()
    })

    it('calls the getUserByEmail internal function', (done) => {
      getUserByEmailSpy.mockReturnValue(Promise.resolve([]))
      createUserSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(getUserByEmailSpy).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      userService.createUserRequestHandler(req, res)
    })

    it('calls the getUserByEmail internal function with the database and email', (done) => {
      getUserByEmailSpy.mockReturnValue(Promise.resolve([]))
      createUserSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(getUserByEmailSpy).toHaveBeenCalledWith(req.userDb, req.body.email)
          done()
        } catch (e) {
          done(e)
        }
      })

      userService.createUserRequestHandler(req, res)
    })

    describe('when the getUserByEmail internal function returns a blank array', () => {
      beforeEach(() => {
        getUserByEmailSpy.mockReturnValue(Promise.resolve([]))
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

    describe('when getUserByEmail returns an object in the array', () => {
      beforeEach(() => {
        getUserByEmailSpy.mockReturnValue(Promise.resolve([{email: 'john.doe@example.com'}]))
      })

      it('returns 400', (done) => {
        res.on('end', () => {
          try {
            expect(res._getStatusCode()).toBe(400)
            done()
          } catch (e) {
            done(e)
          }
        })

        userService.createUserRequestHandler(req, res)
      })
    })
  })

  describe('getUsersRequestHandler', () => {
    let getUserByEmailSpy
    let getUsersSpy
    let req
    let res

    describe('when the email query parameter is set', () => {
      const fakeUserDoc = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        address: {
          firstLine: '123 example street'
        }
      }

      beforeEach(() => {
        getUserByEmailSpy = jest.spyOn(userService.internal, '_getUserByEmail')
        req = httpMocks.createRequest({
          method: 'GET',
          path: '/user',
          query: {
            email: 'john.doe@example.com'
          },
          userDb: {}
        })
        res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
      })

      afterEach(() => {
        getUserByEmailSpy.mockReset()
      })

      afterAll(() => {
        getUserByEmailSpy.mockRestore()
      })

      it('calls the getUserByEmail internal function', (done) => {
        getUserByEmailSpy.mockReturnValue(Promise.resolve([fakeUserDoc]))

        res.on('end', () => {
          try {
            expect(getUserByEmailSpy).toHaveBeenCalledTimes(1)
            done()
          } catch (e) {
            done(e)
          }
        })

        userService.getUsersRequestHandler(req, res)
      })

      it('calls the getUserByEmail internal function with the database and email', (done) => {
        getUserByEmailSpy.mockReturnValue(Promise.resolve([fakeUserDoc]))

        res.on('end', () => {
          try {
            expect(getUserByEmailSpy).toHaveBeenCalledWith(req.userDb, req.query.email)
            done()
          } catch (e) {
            done(e)
          }
        })

        userService.getUsersRequestHandler(req, res)
      })

      describe('when the getUserByEmail internal function succeeds', () => {
        it('returns 200', (done) => {
          getUserByEmailSpy.mockReturnValue(Promise.resolve([fakeUserDoc]))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(200)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.getUsersRequestHandler(req, res)
        })

        it('returns the user document in the body', (done) => {
          getUserByEmailSpy.mockReturnValue(Promise.resolve([fakeUserDoc]))

          res.on('end', () => {
            try {
              expect(res._getData()).toEqual([fakeUserDoc])
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.getUsersRequestHandler(req, res)
        })
      })

      describe('when the getUserByEmail internal function fails', () => {
        describe('with a 400', () => {
          it('returns a 400', (done) => {
            const error = {
              statusCode: 400,
              message: 'bad request'
            }
            getUserByEmailSpy.mockReturnValue(Promise.reject(error))

            res.on('end', () => {
              try {
                expect(res._getStatusCode()).toEqual(400)
                done()
              } catch (e) {
                done(e)
              }
            })

            userService.getUsersRequestHandler(req, res)
          })

          it('returns the error in the body', (done) => {
            const error = {
              statusCode: 400,
              message: 'bad request'
            }
            getUserByEmailSpy.mockReturnValue(Promise.reject(error))

            res.on('end', () => {
              try {
                expect(res._getData()).toBe(error)
                done()
              } catch (e) {
                done(e)
              }
            })

            userService.getUsersRequestHandler(req, res)
          })
        })

        describe('with a 404', () => {
          it('returns a 404', (done) => {
            const error = {
              statusCode: 404,
              message: 'not found'
            }
            getUserByEmailSpy.mockReturnValue(Promise.reject(error))

            res.on('end', () => {
              try {
                expect(res._getStatusCode()).toEqual(404)
                done()
              } catch (e) {
                done(e)
              }
            })

            userService.getUsersRequestHandler(req, res)
          })

          it('returns the error in the body', (done) => {
            const error = {
              statusCode: 404,
              message: 'not found'
            }
            getUserByEmailSpy.mockReturnValue(Promise.reject(error))

            res.on('end', () => {
              try {
                expect(res._getData()).toBe(error)
                done()
              } catch (e) {
                done(e)
              }
            })

            userService.getUsersRequestHandler(req, res)
          })
        })

        describe('with a 500', () => {
          it('returns a 500', (done) => {
            const error = {
              statusCode: 500,
              message: 'internal server error'
            }
            getUserByEmailSpy.mockReturnValue(Promise.reject(error))

            res.on('end', () => {
              try {
                expect(res._getStatusCode()).toEqual(500)
                done()
              } catch (e) {
                done(e)
              }
            })

            userService.getUsersRequestHandler(req, res)
          })

          it('returns the error in the body', (done) => {
            const error = {
              statusCode: 500,
              message: 'internal server error'
            }
            getUserByEmailSpy.mockReturnValue(Promise.reject(error))

            res.on('end', () => {
              try {
                expect(res._getData()).toBe(error)
                done()
              } catch (e) {
                done(e)
              }
            })

            userService.getUsersRequestHandler(req, res)
          })
        })
      })
    })

    describe('when the email query parameter is not set', () => {
      const fakeUserDoc = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        address: {
          firstLine: '123 example street'
        }
      }

      beforeEach(() => {
        getUsersSpy = jest.spyOn(userService.internal, '_getUsers')
        req = httpMocks.createRequest({
          method: 'GET',
          path: '/user',
          userDb: {}
        })
        res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
      })

      afterEach(() => {
        getUsersSpy.mockReset()
      })

      afterAll(() => {
        getUsersSpy.mockRestore()
      })

      it('calls the getUsers internal function', (done) => {
        getUsersSpy.mockReturnValue(Promise.resolve([fakeUserDoc]))

        res.on('end', () => {
          try {
            expect(getUsersSpy).toHaveBeenCalledTimes(1)
            done()
          } catch (e) {
            done(e)
          }
        })

        userService.getUsersRequestHandler(req, res)
      })

      it('calls the getUsers internal function with the database', (done) => {
        getUsersSpy.mockReturnValue(Promise.resolve([fakeUserDoc]))

        res.on('end', () => {
          try {
            expect(getUsersSpy).toHaveBeenCalledWith(req.userDb)
            done()
          } catch (e) {
            done(e)
          }
        })

        userService.getUsersRequestHandler(req, res)
      })

      describe('when the getUsers internal function succeeds', () => {
        it('returns 200', (done) => {
          getUsersSpy.mockReturnValue(Promise.resolve([fakeUserDoc]))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(200)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.getUsersRequestHandler(req, res)
        })

        it('returns the user document in the body', (done) => {
          getUsersSpy.mockReturnValue(Promise.resolve([fakeUserDoc]))

          res.on('end', () => {
            try {
              expect(res._getData()).toEqual([fakeUserDoc])
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.getUsersRequestHandler(req, res)
        })
      })

      describe('when the getUsers internal function fails', () => {
        describe('with a 400', () => {
          it('returns a 400', (done) => {
            const error = {
              statusCode: 400,
              message: 'bad request'
            }
            getUsersSpy.mockReturnValue(Promise.reject(error))

            res.on('end', () => {
              try {
                expect(res._getStatusCode()).toEqual(400)
                done()
              } catch (e) {
                done(e)
              }
            })

            userService.getUsersRequestHandler(req, res)
          })

          it('returns the error in the body', (done) => {
            const error = {
              statusCode: 400,
              message: 'bad request'
            }
            getUsersSpy.mockReturnValue(Promise.reject(error))

            res.on('end', () => {
              try {
                expect(res._getData()).toBe(error)
                done()
              } catch (e) {
                done(e)
              }
            })

            userService.getUsersRequestHandler(req, res)
          })
        })

        describe('with a 404', () => {
          it('returns a 404', (done) => {
            const error = {
              statusCode: 404,
              message: 'not found'
            }
            getUsersSpy.mockReturnValue(Promise.reject(error))

            res.on('end', () => {
              try {
                expect(res._getStatusCode()).toEqual(404)
                done()
              } catch (e) {
                done(e)
              }
            })

            userService.getUsersRequestHandler(req, res)
          })

          it('returns the error in the body', (done) => {
            const error = {
              statusCode: 404,
              message: 'not found'
            }
            getUsersSpy.mockReturnValue(Promise.reject(error))

            res.on('end', () => {
              try {
                expect(res._getData()).toBe(error)
                done()
              } catch (e) {
                done(e)
              }
            })

            userService.getUsersRequestHandler(req, res)
          })
        })

        describe('with a 500', () => {
          it('returns a 500', (done) => {
            const error = {
              statusCode: 500,
              message: 'internal server error'
            }
            getUsersSpy.mockReturnValue(Promise.reject(error))

            res.on('end', () => {
              try {
                expect(res._getStatusCode()).toEqual(500)
                done()
              } catch (e) {
                done(e)
              }
            })

            userService.getUsersRequestHandler(req, res)
          })

          it('returns the error in the body', (done) => {
            const error = {
              statusCode: 500,
              message: 'internal server error'
            }
            getUsersSpy.mockReturnValue(Promise.reject(error))

            res.on('end', () => {
              try {
                expect(res._getData()).toBe(error)
                done()
              } catch (e) {
                done(e)
              }
            })

            userService.getUsersRequestHandler(req, res)
          })
        })
      })
    })
  })

  describe('getUserByIdRequestHandler', () => {
    const fakeUserDoc = {
      name: 'John Doe',
      email: 'john.doe@example.com'
    }
    let getUserByIdSpy
    let req
    let res

    beforeEach(() => {
      getUserByIdSpy = jest.spyOn(userService.internal, '_getUserById')
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
      getUserByIdSpy.mockReset()
    })

    afterAll(() => {
      getUserByIdSpy.mockRestore()
    })

    it('calls the getUserById internal function', (done) => {
      getUserByIdSpy.mockReturnValue(Promise.resolve(fakeUserDoc))

      res.on('end', () => {
        try {
          expect(getUserByIdSpy).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      userService.getUserByIdRequestHandler(req, res)
    })

    it('calls the getUserById internal function with the database and the body of the request', (done) => {
      getUserByIdSpy.mockReturnValue(Promise.resolve(fakeUserDoc))

      res.on('end', () => {
        try {
          expect(getUserByIdSpy).toHaveBeenCalledWith(req.userDb, req.params.id)
          done()
        } catch (e) {
          done(e)
        }
      })

      userService.getUserByIdRequestHandler(req, res)
    })

    describe('when the getUserById internal function succeeds', () => {
      it('returns 200', (done) => {
        getUserByIdSpy.mockReturnValue(Promise.resolve(fakeUserDoc))

        res.on('end', () => {
          try {
            expect(res._getStatusCode()).toEqual(200)
            done()
          } catch (e) {
            done(e)
          }
        })

        userService.getUserByIdRequestHandler(req, res)
      })

      it('returns the user information in the body', (done) => {
        getUserByIdSpy.mockReturnValue(Promise.resolve(fakeUserDoc))

        res.on('end', () => {
          try {
            expect(res._getData()).toBe(fakeUserDoc)
            done()
          } catch (e) {
            done(e)
          }
        })

        userService.getUserByIdRequestHandler(req, res)
      })
    })

    describe('when the getUserById internal function fails', () => {
      describe('with a 400', () => {
        it('returns a 400', (done) => {
          const error = {
            statusCode: 400,
            message: 'bad request'
          }
          getUserByIdSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(400)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.getUserByIdRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            statusCode: 400,
            message: 'bad request'
          }
          getUserByIdSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.getUserByIdRequestHandler(req, res)
        })
      })

      describe('with a 404', () => {
        it('returns a 404', (done) => {
          const error = {
            statusCode: 404,
            message: 'not found'
          }
          getUserByIdSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(404)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.getUserByIdRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            statusCode: 404,
            message: 'not found'
          }
          getUserByIdSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.getUserByIdRequestHandler(req, res)
        })
      })

      describe('with a 500', () => {
        it('returns a 500', (done) => {
          const error = {
            statusCode: 500,
            message: 'internal server error'
          }
          getUserByIdSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(500)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.getUserByIdRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            statusCode: 500,
            message: 'internal server error'
          }
          getUserByIdSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.getUserByIdRequestHandler(req, res)
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

  describe('loginUserRequestHandler', () => {
    let getUserByEmailSpy
    let checkPasswordSpy
    let loginUserSpy
    let req
    let res
    const user = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'dfnejnfnakiurndmfirsnjnir',
      address: {
        firstLine: '123 example street',
        county: 'example',
        postcode: 'ab12cd'
      }
    }

    beforeEach(() => {
      getUserByEmailSpy = jest.spyOn(userService.internal, '_getUserByEmail')
      checkPasswordSpy = jest.spyOn(userService.internal, '_checkPassword')
      loginUserSpy = jest.spyOn(userService.internal, '_loginUser')

      req = httpMocks.createRequest({
        method: 'POST',
        path: '/user/login',
        body: {
          email: 'john.doe@example.com',
          password: 'pass'
        },
        userDb: {}
      })
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
    })

    afterEach(() => {
      getUserByEmailSpy.mockReset()
      checkPasswordSpy.mockReset()
      loginUserSpy.mockReset()
    })

    afterAll(() => {
      getUserByEmailSpy.mockRestore()
      checkPasswordSpy.mockRestore()
      loginUserSpy.mockRestore()
    })

    it('calls the getUserByEmail internal function', (done) => {
      getUserByEmailSpy.mockReturnValue(Promise.resolve())
      checkPasswordSpy.mockReturnValue(Promise.resolve())
      loginUserSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(getUserByEmailSpy).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      userService.loginUserRequestHandler(req, res)
    })

    it('calls the getUserByEmail internal function with the database and email', (done) => {
      getUserByEmailSpy.mockReturnValue(Promise.resolve())
      checkPasswordSpy.mockReturnValue(Promise.resolve())
      loginUserSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(getUserByEmailSpy).toHaveBeenCalledWith(req.userDb, req.body.email)
          done()
        } catch (e) {
          done(e)
        }
      })

      userService.loginUserRequestHandler(req, res)
    })

    describe('when the getUserByEmail internal function succeeds', () => {
      it('calls the checkPassword internal function', (done) => {
        getUserByEmailSpy.mockReturnValue(Promise.resolve([user]))
        checkPasswordSpy.mockReturnValue(Promise.resolve())
        loginUserSpy.mockReturnValue(Promise.resolve())

        res.on('end', () => {
          try {
            expect(checkPasswordSpy).toHaveBeenCalledTimes(1)
            done()
          } catch (e) {
            done(e)
          }
        })

        userService.loginUserRequestHandler(req, res)
      })

      it('calls the checkPassword internal function with the entered password and the stored hash', (done) => {
        getUserByEmailSpy.mockReturnValue(Promise.resolve([user]))
        checkPasswordSpy.mockReturnValue(Promise.resolve())
        loginUserSpy.mockReturnValue(Promise.resolve())

        res.on('end', () => {
          try {
            expect(checkPasswordSpy).toHaveBeenCalledWith(req.body.password, user.password)
            done()
          } catch (e) {
            done(e)
          }
        })

        userService.loginUserRequestHandler(req, res)
      })

      describe('when the checkPassword internal function succeeds', () => {
        it('calls the loginUser internal function', (done) => {
          getUserByEmailSpy.mockReturnValue(Promise.resolve([user]))
          checkPasswordSpy.mockReturnValue(Promise.resolve())
          loginUserSpy.mockReturnValue(Promise.resolve())

          res.on('end', () => {
            try {
              expect(loginUserSpy).toHaveBeenCalledTimes(1)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.loginUserRequestHandler(req, res)
        })

        it('calls the loginUser internal function with the user', (done) => {
          getUserByEmailSpy.mockReturnValue(Promise.resolve([user]))
          checkPasswordSpy.mockReturnValue(Promise.resolve())
          loginUserSpy.mockReturnValue(Promise.resolve())

          res.on('end', () => {
            try {
              expect(loginUserSpy).toHaveBeenCalledWith(user)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.loginUserRequestHandler(req, res)
        })

        describe('when the loginUser internal function succeeds', () => {
          it('returns 200', (done) => {
            getUserByEmailSpy.mockReturnValue(Promise.resolve([user]))
            checkPasswordSpy.mockReturnValue(Promise.resolve())
            loginUserSpy.mockReturnValue(Promise.resolve('fakeJWT'))

            res.on('end', () => {
              try {
                expect(res._getStatusCode()).toEqual(200)
                done()
              } catch (e) {
                done(e)
              }
            })

            userService.loginUserRequestHandler(req, res)
          })

          it('returns the jwt in the body', (done) => {
            getUserByEmailSpy.mockReturnValue(Promise.resolve([user]))
            checkPasswordSpy.mockReturnValue(Promise.resolve())
            loginUserSpy.mockReturnValue(Promise.resolve('fakeJWT'))

            res.on('end', () => {
              try {
                expect(res._getData()).toEqual({auth: true, token: 'fakeJWT'})
                done()
              } catch (e) {
                done(e)
              }
            })

            userService.loginUserRequestHandler(req, res)
          })
        })

        describe('when the loginUser internal function fails', () => {
          beforeEach(() => {
            getUserByEmailSpy.mockReturnValue(Promise.resolve([user]))
            checkPasswordSpy.mockReturnValue(Promise.resolve())
          })

          describe('with a 400', () => {
            it('returns a 400', (done) => {
              const error = {
                statusCode: 400,
                message: 'bad request'
              }
              loginUserSpy.mockReturnValue(Promise.reject(error))

              res.on('end', () => {
                try {
                  expect(res._getStatusCode()).toEqual(400)
                  done()
                } catch (e) {
                  done(e)
                }
              })

              userService.loginUserRequestHandler(req, res)
            })

            it('returns the error in the body', (done) => {
              const error = {
                statusCode: 400,
                message: 'bad request'
              }
              loginUserSpy.mockReturnValue(Promise.reject(error))

              res.on('end', () => {
                try {
                  expect(res._getData()).toBe(error)
                  done()
                } catch (e) {
                  done(e)
                }
              })

              userService.loginUserRequestHandler(req, res)
            })
          })

          describe('with a 404', () => {
            it('returns a 404', (done) => {
              const error = {
                statusCode: 404,
                message: 'not found'
              }
              loginUserSpy.mockReturnValue(Promise.reject(error))

              res.on('end', () => {
                try {
                  expect(res._getStatusCode()).toEqual(404)
                  done()
                } catch (e) {
                  done(e)
                }
              })

              userService.loginUserRequestHandler(req, res)
            })

            it('returns the error in the body', (done) => {
              const error = {
                statusCode: 404,
                message: 'not found'
              }
              loginUserSpy.mockReturnValue(Promise.reject(error))

              res.on('end', () => {
                try {
                  expect(res._getData()).toBe(error)
                  done()
                } catch (e) {
                  done(e)
                }
              })

              userService.loginUserRequestHandler(req, res)
            })
          })

          describe('with a 500', () => {
            it('returns a 500', (done) => {
              const error = {
                statusCode: 500,
                message: 'internal server error'
              }
              loginUserSpy.mockReturnValue(Promise.reject(error))

              res.on('end', () => {
                try {
                  expect(res._getStatusCode()).toEqual(500)
                  done()
                } catch (e) {
                  done(e)
                }
              })

              userService.loginUserRequestHandler(req, res)
            })

            it('returns the error in the body', (done) => {
              const error = {
                statusCode: 500,
                message: 'internal server error'
              }
              loginUserSpy.mockReturnValue(Promise.reject(error))

              res.on('end', () => {
                try {
                  expect(res._getData()).toBe(error)
                  done()
                } catch (e) {
                  done(e)
                }
              })

              userService.loginUserRequestHandler(req, res)
            })
          })

          describe('with a unexpected error', () => {
            it('returns a 500', (done) => {
              const error = {
                message: 'bang!'
              }
              loginUserSpy.mockReturnValue(Promise.reject(error))

              res.on('end', () => {
                try {
                  expect(res._getStatusCode()).toEqual(500)
                  done()
                } catch (e) {
                  done(e)
                }
              })

              userService.loginUserRequestHandler(req, res)
            })

            it('returns the error in the body', (done) => {
              const error = {
                message: 'bang!'
              }
              loginUserSpy.mockReturnValue(Promise.reject(error))

              res.on('end', () => {
                try {
                  expect(res._getData()).toBe(error)
                  done()
                } catch (e) {
                  done(e)
                }
              })

              userService.loginUserRequestHandler(req, res)
            })
          })
        })
      })

      describe('when the checkPassword internal function fails', () => {
        beforeEach(() => {
          getUserByEmailSpy.mockReturnValue(Promise.resolve([user]))
        })

        describe('with a 400', () => {
          it('returns a 400', (done) => {
            const error = {
              statusCode: 400,
              message: 'bad request'
            }
            checkPasswordSpy.mockReturnValue(Promise.reject(error))

            res.on('end', () => {
              try {
                expect(res._getStatusCode()).toEqual(400)
                done()
              } catch (e) {
                done(e)
              }
            })

            userService.loginUserRequestHandler(req, res)
          })

          it('returns the error in the body', (done) => {
            const error = {
              statusCode: 400,
              message: 'bad request'
            }
            checkPasswordSpy.mockReturnValue(Promise.reject(error))

            res.on('end', () => {
              try {
                expect(res._getData()).toBe(error)
                done()
              } catch (e) {
                done(e)
              }
            })

            userService.loginUserRequestHandler(req, res)
          })
        })

        describe('with a 404', () => {
          it('returns a 404', (done) => {
            const error = {
              statusCode: 404,
              message: 'not found'
            }
            checkPasswordSpy.mockReturnValue(Promise.reject(error))

            res.on('end', () => {
              try {
                expect(res._getStatusCode()).toEqual(404)
                done()
              } catch (e) {
                done(e)
              }
            })

            userService.loginUserRequestHandler(req, res)
          })

          it('returns the error in the body', (done) => {
            const error = {
              statusCode: 404,
              message: 'not found'
            }
            checkPasswordSpy.mockReturnValue(Promise.reject(error))

            res.on('end', () => {
              try {
                expect(res._getData()).toBe(error)
                done()
              } catch (e) {
                done(e)
              }
            })

            userService.loginUserRequestHandler(req, res)
          })
        })

        describe('with a 500', () => {
          it('returns a 500', (done) => {
            const error = {
              statusCode: 500,
              message: 'internal server error'
            }
            checkPasswordSpy.mockReturnValue(Promise.reject(error))

            res.on('end', () => {
              try {
                expect(res._getStatusCode()).toEqual(500)
                done()
              } catch (e) {
                done(e)
              }
            })

            userService.loginUserRequestHandler(req, res)
          })

          it('returns the error in the body', (done) => {
            const error = {
              statusCode: 500,
              message: 'internal server error'
            }
            checkPasswordSpy.mockReturnValue(Promise.reject(error))

            res.on('end', () => {
              try {
                expect(res._getData()).toBe(error)
                done()
              } catch (e) {
                done(e)
              }
            })

            userService.loginUserRequestHandler(req, res)
          })
        })

        describe('with a unexpected error', () => {
          it('returns a 500', (done) => {
            const error = {
              message: 'bang!'
            }
            checkPasswordSpy.mockReturnValue(Promise.reject(error))

            res.on('end', () => {
              try {
                expect(res._getStatusCode()).toEqual(500)
                done()
              } catch (e) {
                done(e)
              }
            })

            userService.loginUserRequestHandler(req, res)
          })

          it('returns the error in the body', (done) => {
            const error = {
              message: 'bang!'
            }
            checkPasswordSpy.mockReturnValue(Promise.reject(error))

            res.on('end', () => {
              try {
                expect(res._getData()).toBe(error)
                done()
              } catch (e) {
                done(e)
              }
            })

            userService.loginUserRequestHandler(req, res)
          })
        })
      })
    })

    describe('when the getUserByEmail internal function fails', () => {
      describe('with a 400', () => {
        it('returns a 400', (done) => {
          const error = {
            statusCode: 400,
            message: 'bad request'
          }
          getUserByEmailSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(400)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.loginUserRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            statusCode: 400,
            message: 'bad request'
          }
          getUserByEmailSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.loginUserRequestHandler(req, res)
        })
      })

      describe('with a 404', () => {
        it('returns a 404', (done) => {
          const error = {
            statusCode: 404,
            message: 'not found'
          }
          getUserByEmailSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(404)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.loginUserRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            statusCode: 404,
            message: 'not found'
          }
          getUserByEmailSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.loginUserRequestHandler(req, res)
        })
      })

      describe('with a 500', () => {
        it('returns a 500', (done) => {
          const error = {
            statusCode: 500,
            message: 'internal server error'
          }
          getUserByEmailSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(500)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.loginUserRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            statusCode: 500,
            message: 'internal server error'
          }
          getUserByEmailSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.loginUserRequestHandler(req, res)
        })
      })

      describe('with a unexpected error', () => {
        it('returns a 500', (done) => {
          const error = {
            message: 'bang!'
          }
          getUserByEmailSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(500)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.loginUserRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            message: 'bang!'
          }
          getUserByEmailSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          userService.loginUserRequestHandler(req, res)
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

    describe('_getUsers', () => {
      let fakeDatabase
      let getAllUsersSpy

      beforeEach(() => {
        fakeDatabase = {
          getAllUsers: () => {}
        }
        getAllUsersSpy = jest.spyOn(fakeDatabase, 'getAllUsers')
      })

      afterEach(() => {
        getAllUsersSpy.mockReset()
        getAllUsersSpy.mockRestore()
      })

      it('calls the getAllUsers database method', () => {
        getAllUsersSpy.mockReturnValue(Promise.resolve())
        return userService.internal._getUsers(fakeDatabase)
          .then(() => {
            expect(getAllUsersSpy).toHaveBeenCalledTimes(1)
          })
      })

      describe('when the getAllUsers database method resolves', () => {
        const fakeDocArray = [{}, {}, {}]
        it('returns a resolved promise', () => {
          getAllUsersSpy.mockReturnValue(Promise.resolve(fakeDocArray))
          return userService.internal._getUsers(fakeDatabase)
        })

        it('returns the array of documents', () => {
          getAllUsersSpy.mockReturnValue(Promise.resolve(fakeDocArray))
          return userService.internal._getUsers(fakeDatabase)
            .then(documents => {
              expect(documents).toEqual(fakeDocArray)
            })
        })
      })

      describe('when the getAllUsers database method rejects', () => {
        it('returns a rejected promise with the error in the body', () => {
          expect.assertions(1)
          getAllUsersSpy.mockReturnValue(Promise.reject(new Error('Bang!')))
          return userService.internal._getUsers(fakeDatabase)
            .catch(error => {
              expect(error.message).toEqual('Bang!')
            })
        })
      })
    })

    describe('_getUserByEmail', () => {
      let fakeDatabase
      let getUserByEmailSpy
      let email = 'john.doe@example.com'

      beforeEach(() => {
        fakeDatabase = {
          getUserByEmail: () => {}
        }
        getUserByEmailSpy = jest.spyOn(fakeDatabase, 'getUserByEmail')
      })

      afterEach(() => {
        getUserByEmailSpy.mockReset()
        getUserByEmailSpy.mockRestore()
      })

      describe('when the userEmail is not defined', () => {
        it('does not call the getUserByEmail database method', () => {
          expect.assertions(1)
          return userService.internal._getUserByEmail(fakeDatabase, undefined)
            .catch(() => {
              expect(getUserByEmailSpy).not.toHaveBeenCalled()
            })
        })

        it('returns a rejected promise with the error in the body', () => {
          expect.assertions(1)
          return userService.internal._getUserByEmail(fakeDatabase, undefined)
            .catch(error => {
              expect(error).toEqual({
                statusCode: 400,
                message: 'The email provided was undefined',
                name: 'bad request'
              })
            })
        })
      })

      describe('when the userEmail is defined', () => {
        it('calls the getUserByEmail database method', () => {
          getUserByEmailSpy.mockReturnValue(Promise.resolve())
          return userService.internal._getUserByEmail(fakeDatabase, email)
            .then(() => {
              expect(getUserByEmailSpy).toHaveBeenCalledTimes(1)
            })
        })

        describe('when the getUserByEmail database method resolves', () => {
          const fakeDoc = [
            {
              name: 'John Doe',
              email: 'john.doe@example.com'
            }
          ]

          it('returns a resolved promise', () => {
            getUserByEmailSpy.mockReturnValue(Promise.resolve(fakeDoc))
            return userService.internal._getUserByEmail(fakeDatabase, email)
          })

          it('returns the array of documents', () => {
            getUserByEmailSpy.mockReturnValue(Promise.resolve(fakeDoc))
            return userService.internal._getUserByEmail(fakeDatabase, email)
              .then(document => {
                expect(document).toEqual(fakeDoc)
              })
          })
        })

        describe('when the getUserByEmail database method rejects', () => {
          it('returns a rejected promise with the error in the body', () => {
            expect.assertions(1)
            getUserByEmailSpy.mockReturnValue(Promise.reject(new Error('Bang!')))
            return userService.internal._getUserByEmail(fakeDatabase, email)
              .catch(error => {
                expect(error.message).toEqual('Bang!')
              })
          })
        })
      })
    })

    describe('_getUserById', () => {
      let fakeDatabase
      let getUserByIdSpy

      beforeEach(() => {
        fakeDatabase = {
          getUserById: () => {}
        }
        getUserByIdSpy = jest.spyOn(fakeDatabase, 'getUserById')
      })

      afterEach(() => {
        getUserByIdSpy.mockReset()
        getUserByIdSpy.mockRestore()
      })

      describe('when the userId is undefined', () => {
        it('does not call the getUserById database method', () => {
          expect.assertions(1)
          return userService.internal._getUserById(fakeDatabase, undefined)
            .catch(() => {
              expect(getUserByIdSpy).toHaveBeenCalledTimes(0)
            })
        })

        it('returns a rejected promise with an error', () => {
          const expectedError = {
            statusCode: 400,
            message: 'The id provided was undefined',
            name: 'bad request'
          }
          expect.assertions(1)
          return userService.internal._getUserById(fakeDatabase, undefined)
            .catch(error => {
              expect(error).toEqual(expectedError)
            })
        })
      })

      describe('when the userId is not a string', () => {
        it('does not call the getUserById database method', () => {
          expect.assertions(1)
          return userService.internal._getUserById(fakeDatabase, 1234)
            .catch(() => {
              expect(getUserByIdSpy).toHaveBeenCalledTimes(0)
            })
        })

        it('returns a rejected promise with an error', () => {
          const expectedError = {
            statusCode: 400,
            message: 'The id provided was not in string format',
            name: 'bad request'
          }
          expect.assertions(1)
          return userService.internal._getUserById(fakeDatabase, 1234)
            .catch(error => {
              expect(error).toEqual(expectedError)
            })
        })
      })

      describe('when the userId does not match the regex', () => {
        it('does not call the getUserById database method', () => {
          expect.assertions(1)
          return userService.internal._getUserById(fakeDatabase, '1234')
            .catch(() => {
              expect(getUserByIdSpy).toHaveBeenCalledTimes(0)
            })
        })

        it('returns a rejected promise with an error', () => {
          const expectedError = {
            statusCode: 400,
            message: 'Id did not match the following regex: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/',
            name: 'bad request'
          }
          expect.assertions(1)
          return userService.internal._getUserById(fakeDatabase, '1234')
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

        it('calls the getUserById database method', () => {
          getUserByIdSpy.mockReturnValue(Promise.resolve())
          return userService.internal._getUserById(fakeDatabase, '1234')
            .then(() => {
              expect(getUserByIdSpy).toHaveBeenCalledTimes(1)
            })
        })

        describe('when the getUserById database method succeeds', () => {
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
            getUserByIdSpy.mockReturnValue(Promise.resolve(fakeUserDoc))
            return userService.internal._getUserById(fakeDatabase, '1234')
              .then(userDoc => {
                expect(userDoc).toEqual(fakeUserDoc)
              })
          })
        })

        describe('when the getUserById database method fails', () => {
          it('returns a rejected promise with the error in the body', () => {
            expect.assertions(1)
            getUserByIdSpy.mockReturnValue(Promise.reject(new Error('Bang!')))
            return userService.internal._getUserById(fakeDatabase, '1234')
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

    describe('_checkPassword', () => {
      let compareSpy

      beforeEach(() => {
        compareSpy = jest.spyOn(bcrypt, 'compare')
      })

      afterEach(() => {
        compareSpy.mockReset()
      })

      describe('when the passwords match', () => {
        beforeEach(() => {
          compareSpy.mockReturnValue(Promise.resolve(true))
        })

        it('returns a resolved promise', () => {
          return userService.internal._checkPassword('goodPass', 'dnsidhfsdvis')
        })
      })

      describe('when the passwords dont match', () => {
        beforeEach(() => {
          compareSpy.mockReturnValue(Promise.resolve(false))
        })

        it('returns a rejected promise with an error', () => {
          expect.assertions(1)
          return userService.internal._checkPassword('badPass', 'dnsidhfsdvis')
            .catch(error => {
              expect(error).toEqual({
                statusCode: 401,
                message: 'Password does not match',
                name: 'Not Authenticated'
              })
            })
        })
      })
    })

    describe('_loginUser', () => {
      let jwtSignSpy
      let readFileSyncSpy
      const user = {
        id: '1234-abcd',
        name: 'John Doe',
        email: 'john.doe@example.com'
      }

      beforeEach(() => {
        jwtSignSpy = jest.spyOn(jwt, 'sign')
        readFileSyncSpy = jest.spyOn(fs, 'readFileSync').mockReturnValue('secret')
      })

      afterEach(() => {
        jwtSignSpy.mockReset()
        readFileSyncSpy.mockReset()
      })

      afterAll(() => {
        readFileSyncSpy.mockRestore()
      })

      describe('when the jwt signs successfully', () => {
        beforeEach(() => {
          jwtSignSpy.mockImplementation((a, b, c, cb) => {
            cb(null, 'fakeToken')
          })
        })

        it('returns a resolved promise with the jwt in the body', () => {
          return userService.internal._loginUser(user)
            .then(token => {
              expect(token).toEqual('fakeToken')
            })
        })
      })

      describe('when the jwt fails to sign', () => {
        beforeEach(() => {
          jwtSignSpy.mockImplementation((a, b, c, cb) => {
            cb(new Error('Bang!'), null)
          })
        })

        it('returns a rejected promise with the error in the body', () => {
          expect.assertions(1)
          return userService.internal._loginUser(user)
            .catch(error => {
              expect(error.message).toEqual('Bang!')
            })
        })
      })
    })
  })
})

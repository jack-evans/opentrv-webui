import toBeType from 'jest-tobetype'

const httpMocks = require('node-mocks-http')
const Promise = require('bluebird')
expect.extend(toBeType)

describe('policyManagement.js', () => {
  let policyManagement

  beforeEach(() => {
    policyManagement = require('../../lib/policyManagementService/policyManagement.js')
  })

  afterEach(() => {
    delete require.cache[require.resolve('../../lib/policyManagementService/policyManagement.js')]
  })

  describe('createPolicyRequestHandler', () => {
    let req
    let res
    let createPolicySpy

    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'POST',
        path: '/policy',
        body: {
          name: 'policy 1',
          startTime: ['16:00'],
          endTime: ['19:00'],
          targetTemp: [24, 25]
        },
        policyDb: {}
      })
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
      createPolicySpy = jest.spyOn(policyManagement.internal, '_createPolicy')
    })

    afterEach(() => {
      createPolicySpy.mockReset()
    })

    afterAll(() => {
      createPolicySpy.mockRestore()
    })

    it('calls the _createPolicy internal function', (done) => {
      createPolicySpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(createPolicySpy).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      policyManagement.createPolicyRequestHandler(req, res)
    })

    it('calls the _createPolicy internal function with the database and the body of the request', (done) => {
      createPolicySpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(createPolicySpy).toHaveBeenCalledWith(req.policyDb, req.body)
          done()
        } catch (e) {
          done(e)
        }
      })

      policyManagement.createPolicyRequestHandler(req, res)
    })

    describe('when the _createPolicy internal function succeeds', () => {
      beforeEach(() => {
        createPolicySpy.mockReturnValue(Promise.resolve())
      })

      it('returns 201', (done) => {
        res.on('end', () => {
          try {
            expect(res._getStatusCode()).toEqual(201)
            done()
          } catch (e) {
            done(e)
          }
        })

        policyManagement.createPolicyRequestHandler(req, res)
      })
    })

    describe('when the _createPolicy internal function fails', () => {
      describe('with a 400', () => {
        const error = {
          statusCode: 400,
          message: 'bad request'
        }

        beforeEach(() => {
          createPolicySpy.mockReturnValue(Promise.reject(error))
        })

        it('returns a 400', (done) => {
          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(400)
              done()
            } catch (e) {
              done(e)
            }
          })

          policyManagement.createPolicyRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          policyManagement.createPolicyRequestHandler(req, res)
        })
      })

      describe('with a 409', () => {
        const error = {
          statusCode: 409,
          message: 'conflict'
        }

        beforeEach(() => {
          createPolicySpy.mockReturnValue(Promise.reject(error))
        })

        it('returns a 409', (done) => {
          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(409)
              done()
            } catch (e) {
              done(e)
            }
          })

          policyManagement.createPolicyRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          policyManagement.createPolicyRequestHandler(req, res)
        })
      })

      describe('with a 500', () => {
        const error = {
          statusCode: 500,
          message: 'internal server error'
        }

        beforeEach(() => {
          createPolicySpy.mockReturnValue(Promise.reject(error))
        })

        it('returns a 500', (done) => {
          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(500)
              done()
            } catch (e) {
              done(e)
            }
          })

          policyManagement.createPolicyRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          policyManagement.createPolicyRequestHandler(req, res)
        })
      })

      describe('with an unexpected error', () => {
        const error = {
          message: 'Bang!'
        }

        beforeEach(() => {
          createPolicySpy.mockReturnValue(Promise.reject(error))
        })

        it('returns a 500', (done) => {
          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(500)
              done()
            } catch (e) {
              done(e)
            }
          })

          policyManagement.createPolicyRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          policyManagement.createPolicyRequestHandler(req, res)
        })
      })
    })
  })

  describe('getAllPoliciesRequestHandler', () => {
    let req
    let res
    let getAllPoliciesSpy

    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'GET',
        path: '/policy',
        policyDb: {}
      })
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
      getAllPoliciesSpy = jest.spyOn(policyManagement.internal, '_getAllPolicies')
    })

    afterEach(() => {
      getAllPoliciesSpy.mockReset()
    })

    afterAll(() => {
      getAllPoliciesSpy.mockRestore()
    })

    it('calls the _getAllPolicies internal function', (done) => {
      getAllPoliciesSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(getAllPoliciesSpy).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      policyManagement.getAllPoliciesRequestHandler(req, res)
    })

    describe('when the _getAllPolicies internal function succeeds', () => {
      beforeEach(() => {
        getAllPoliciesSpy.mockReturnValue(Promise.resolve([]))
      })

      it('returns 200', (done) => {
        res.on('end', () => {
          try {
            expect(res._getStatusCode()).toEqual(200)
            done()
          } catch (e) {
            done(e)
          }
        })

        policyManagement.getAllPoliciesRequestHandler(req, res)
      })

      it('returns an array', (done) => {
        res.on('end', () => {
          try {
            expect(res._getData()).toBeType('array')
            done()
          } catch (e) {
            done(e)
          }
        })

        policyManagement.getAllPoliciesRequestHandler(req, res)
      })
    })

    describe('when the _getAllPolicies internal function fails', () => {
      describe('with a 400', () => {
        const error = {
          statusCode: 400,
          message: 'bad request'
        }

        beforeEach(() => {
          getAllPoliciesSpy.mockReturnValue(Promise.reject(error))
        })

        it('returns a 400', (done) => {
          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(400)
              done()
            } catch (e) {
              done(e)
            }
          })

          policyManagement.getAllPoliciesRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          policyManagement.getAllPoliciesRequestHandler(req, res)
        })
      })

      describe('with a 404', () => {
        const error = {
          statusCode: 404,
          message: 'not found'
        }

        beforeEach(() => {
          getAllPoliciesSpy.mockReturnValue(Promise.reject(error))
        })

        it('returns a 404', (done) => {
          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(404)
              done()
            } catch (e) {
              done(e)
            }
          })

          policyManagement.getAllPoliciesRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          policyManagement.getAllPoliciesRequestHandler(req, res)
        })
      })

      describe('with a 500', () => {
        const error = {
          statusCode: 500,
          message: 'internal server error'
        }

        beforeEach(() => {
          getAllPoliciesSpy.mockReturnValue(Promise.reject(error))
        })

        it('returns a 500', (done) => {
          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(500)
              done()
            } catch (e) {
              done(e)
            }
          })

          policyManagement.getAllPoliciesRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          policyManagement.getAllPoliciesRequestHandler(req, res)
        })
      })

      describe('with an unexpected error', () => {
        const error = {
          message: 'Bang!'
        }

        beforeEach(() => {
          getAllPoliciesSpy.mockReturnValue(Promise.reject(error))
        })

        it('returns a 500', (done) => {
          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(500)
              done()
            } catch (e) {
              done(e)
            }
          })

          policyManagement.getAllPoliciesRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          policyManagement.getAllPoliciesRequestHandler(req, res)
        })
      })
    })
  })

  describe('getPolicyByIdRequestHandler', () => {
    let req
    let res
    let getPolicyByIdSpy

    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'GET',
        path: '/policy/1234',
        policyDb: {}
      })
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
      getPolicyByIdSpy = jest.spyOn(policyManagement.internal, '_getPolicyById')
    })

    afterEach(() => {
      getPolicyByIdSpy.mockReset()
    })

    afterAll(() => {
      getPolicyByIdSpy.mockRestore()
    })

    it('calls the _getPolicyById internal function', (done) => {
      getPolicyByIdSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(getPolicyByIdSpy).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      policyManagement.getPolicyByIdRequestHandler(req, res)
    })

    describe('when the _getolicyById internal function succeeds', () => {
      beforeEach(() => {
        getPolicyByIdSpy.mockReturnValue(Promise.resolve({}))
      })

      it('returns 200', (done) => {
        res.on('end', () => {
          try {
            expect(res._getStatusCode()).toEqual(200)
            done()
          } catch (e) {
            done(e)
          }
        })

        policyManagement.getPolicyByIdRequestHandler(req, res)
      })

      it('returns an object', (done) => {
        res.on('end', () => {
          try {
            expect(res._getData()).toBeType('object')
            done()
          } catch (e) {
            done(e)
          }
        })

        policyManagement.getPolicyByIdRequestHandler(req, res)
      })
    })
  })
})

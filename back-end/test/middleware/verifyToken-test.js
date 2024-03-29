
const fs = require('fs')
const httpMocks = require('node-mocks-http')
const jwt = require('jsonwebtoken')
const verifyToken = require('../../lib/middleware/verifyToken')

describe('verifyToken.js', () => {
  let jwtVerifySpy
  let readFileSpy
  let req
  let res
  const next = () => {}

  beforeEach(() => {
    jwtVerifySpy = jest.spyOn(jwt, 'verify')
    readFileSpy = jest.spyOn(fs, 'readFile').mockImplementation((path, options, cb) => {
      cb(null, 'secret')
    })
  })

  afterEach(() => {
    jwtVerifySpy.mockReset()
    readFileSpy.mockReset()
  })

  afterAll(() => {
    jwtVerifySpy.mockRestore()
    readFileSpy.mockRestore()
  })

  describe('when the token is not present in the header', () => {
    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'POST',
        path: '/user',
        body: {
          email: 'john.doe@example.com',
          name: 'John Doe'
        },
        headers: {}
      })
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
    })

    it('returns 403', (done) => {
      res.on('end', () => {
        try {
          expect(res._getStatusCode()).toEqual(403)
          done()
        } catch (e) {
          done(e)
        }
      })

      verifyToken(req, res, next)
    })

    it('returns a body', (done) => {
      const expected = {
        auth: false,
        message: 'No token provided.'
      }

      res.on('end', () => {
        try {
          expect(res._getData()).toEqual(expected)
          done()
        } catch (e) {
          done(e)
        }
      })

      verifyToken(req, res, next)
    })
  })

  describe('when the token is present in the header', () => {
    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'POST',
        path: '/user',
        body: {
          email: 'john.doe@example.com',
          name: 'John Doe'
        },
        headers: {
          'x-opentrv-token': 'fakeJWT'
        }
      })
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
    })

    it('calls the fs.readFile function', (done) => {
      jwtVerifySpy.mockImplementation((token, cert, options, cb) => {
        let user = {
          id: '1234',
          name: 'john doe'
        }
        cb(null, user)
      })

      verifyToken(req, res, (err) => {
        if (err) {
          done(err)
        } else {
          expect(readFileSpy).toHaveBeenCalledTimes(1)
          done()
        }
      })
    })

    describe('when fs.readFile succeeds', () => {
      it('calls the jwt.verify function', (done) => {
        jwtVerifySpy.mockImplementation((token, cert, options, cb) => {
          let user = {
            id: '1234',
            name: 'john doe'
          }
          cb(null, user)
        })

        verifyToken(req, res, (err) => {
          if (err) {
            done(err)
          } else {
            expect(jwtVerifySpy).toHaveBeenCalledTimes(1)
            done()
          }
        })
      })

      describe('when the jwt.verify function succeeds', () => {
        it('sets req.userId', (done) => {
          jwtVerifySpy.mockImplementation((token, cert, options, cb) => {
            let user = {
              id: '1234',
              name: 'john doe'
            }
            cb(null, user)
          })

          verifyToken(req, res, (err) => {
            if (err) {
              done(err)
            } else {
              expect(req.userId).toEqual('1234')
              done()
            }
          })
        })
      })

      describe('when the jwt.verify function fails', () => {
        it('returns 500', (done) => {
          jwtVerifySpy.mockImplementation((token, cert, options, cb) => {
            cb(new Error('Bang!'), null)
          })

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(500)
              done()
            } catch (e) {
              done(e)
            }
          })

          verifyToken(req, res, next)
        })

        it('returns an error in the body', (done) => {
          const expected = {
            auth: false,
            message: 'Failed to verify token.'
          }
          jwtVerifySpy.mockImplementation((token, cert, options, cb) => {
            cb(new Error('Bang!'), null)
          })

          res.on('end', () => {
            try {
              expect(res._getData()).toEqual(expected)
              done()
            } catch (e) {
              done(e)
            }
          })

          verifyToken(req, res, next)
        })
      })
    })

    describe('when fs.readFile fails', () => {
      it('returns 500', (done) => {
        readFileSpy.mockImplementation((path, options, cb) => {
          cb(new Error('Bang!'), null)
        })

        res.on('end', () => {
          try {
            expect(res._getStatusCode()).toEqual(500)
            done()
          } catch (e) {
            done(e)
          }
        })

        verifyToken(req, res, next)
      })

      it('returns an error in the body', (done) => {
        const expected = {
          auth: false,
          message: 'Failed to verify token.'
        }
        readFileSpy.mockImplementation((path, options, cb) => {
          cb(new Error('Bang!'), null)
        })

        res.on('end', () => {
          try {
            expect(res._getData()).toEqual(expected)
            done()
          } catch (e) {
            done(e)
          }
        })

        verifyToken(req, res, next)
      })
    })
  })
})

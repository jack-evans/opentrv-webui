import toBeType from 'jest-tobetype'

const httpMocks = require('node-mocks-http')
const nock = require('nock')
const Promise = require('bluebird')
expect.extend(toBeType)

describe('deviceDiscovery.js', () => {
  let deviceDiscovery

  beforeEach(() => {
    deviceDiscovery = require('../../lib/deviceDiscoveryService/deviceDiscovery')
  })

  afterEach(() => {
    delete require.cache[require.resolve('../../lib/deviceDiscoveryService/deviceDiscovery')]
  })

  describe('createDeviceRequestHandler', () => {
    let req
    let res
    let createDevicesSpy

    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'POST',
        path: '/devices',
        body: {
          devices: [{
            serialNum: 'OTRV-1a2b3c4d5e',
            author: '1a2b3c4d'
          }]
        }
      })
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
      createDevicesSpy = jest.spyOn(deviceDiscovery.internal, '_createDevices')
    })

    afterEach(() => {
      createDevicesSpy.mockReset()
    })

    afterAll(() => {
      createDevicesSpy.mockRestore()
    })

    it('calls the _updateDevice internal function', (done) => {
      createDevicesSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(createDevicesSpy).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      deviceDiscovery.createDeviceRequestHandler(req, res)
    })

    describe('when the _createDevice internal function succeeds', () => {
      beforeEach(() => {
        createDevicesSpy.mockReturnValue(Promise.resolve())
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

        deviceDiscovery.createDeviceRequestHandler(req, res)
      })
    })

    describe('when the _createDevice internal function fails', () => {
      describe('with a 400', () => {
        it('returns a 400', (done) => {
          const error = {
            statusCode: 400,
            message: 'bad request'
          }
          createDevicesSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(400)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.createDeviceRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            statusCode: 400,
            message: 'bad request'
          }
          createDevicesSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.createDeviceRequestHandler(req, res)
        })
      })

      describe('with a 409', () => {
        it('returns a 409', (done) => {
          const error = {
            statusCode: 409,
            message: 'conflict'
          }
          createDevicesSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(409)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.createDeviceRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            statusCode: 409,
            message: 'conflict'
          }
          createDevicesSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.createDeviceRequestHandler(req, res)
        })
      })

      describe('with an unexpected error', () => {
        it('returns a 500', (done) => {
          const error = {
            statusCode: 500,
            message: 'internal server error'
          }
          createDevicesSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(500)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.createDeviceRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            statusCode: 500,
            message: 'internal server error'
          }
          createDevicesSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.createDeviceRequestHandler(req, res)
        })
      })
    })
  })

  describe('discoverAllDevicesRequestHandler', () => {
    let discoverAllDevicesSpy
    let req
    let res

    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'GET',
        path: '/devices'
      })
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
      discoverAllDevicesSpy = jest.spyOn(deviceDiscovery.internal, '_discoverAllDevices')
    })

    afterEach(() => {
      discoverAllDevicesSpy.mockReset()
    })

    afterAll(() => {
      discoverAllDevicesSpy.mockRestore()
    })

    it('calls the discoverAllDevices internal function', (done) => {
      discoverAllDevicesSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(discoverAllDevicesSpy).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      deviceDiscovery.discoverAllDevicesRequestHandler(req, res)
    })

    describe('when the discoverAllDevices internal function succeeds', () => {
      it('returns 200', (done) => {
        discoverAllDevicesSpy.mockReturnValue(Promise.resolve())

        res.on('end', () => {
          try {
            expect(res._getStatusCode()).toEqual(200)
            done()
          } catch (e) {
            done(e)
          }
        })

        deviceDiscovery.discoverAllDevicesRequestHandler(req, res)
      })

      it('returns the array of devices', (done) => {
        let devices = [
          {
            serialNum: '1a',
            temp: 23
          }, {
            serialNum: '2b',
            temp: 34
          }, {
            serialNum: '3c',
            temp: 12
          }
        ]
        discoverAllDevicesSpy.mockReturnValue(Promise.resolve(devices))

        res.on('end', () => {
          let result = res._getData()
          try {
            for (let i = 0; i < devices.length; i++) {
              expect(result[i]).toEqual(devices[i])
            }
            done()
          } catch (e) {
            done(e)
          }
        })

        deviceDiscovery.discoverAllDevicesRequestHandler(req, res)
      })
    })

    describe('when the discoverAllDevices internal function fails', () => {
      describe('with a 400', () => {
        it('returns 400', (done) => {
          const error = {
            statusCode: 400,
            message: 'bad request'
          }
          discoverAllDevicesSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(400)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.discoverAllDevicesRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            message: 'bad request',
            statusCode: 400
          }
          discoverAllDevicesSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toEqual(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.discoverAllDevicesRequestHandler(req, res)
        })
      })

      describe('with a 404', () => {
        it('returns a 404', (done) => {
          const error = {
            statusCode: 404,
            message: 'not found'
          }
          discoverAllDevicesSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(404)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.discoverAllDevicesRequestHandler(req, res)
        })

        it('returns an error in the body', (done) => {
          const error = {
            statusCode: 404,
            message: 'not found'
          }
          discoverAllDevicesSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toEqual(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.discoverAllDevicesRequestHandler(req, res)
        })
      })

      describe('with an unexpected error', () => {
        it('returns a 500', (done) => {
          const error = {
            statusCode: 500,
            message: 'internal server error'
          }
          discoverAllDevicesSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(500)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.discoverAllDevicesRequestHandler(req, res)
        })

        it('returns an error in the body', (done) => {
          const error = {
            statusCode: 500,
            message: 'internal server error'
          }
          discoverAllDevicesSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toEqual(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.discoverAllDevicesRequestHandler(req, res)
        })
      })
    })
  })

  describe('getDevicesRequestHandler', () => {
    let getDeviceSpy
    let req
    let res
    let id = '1234'

    const fakeDb = {}

    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'GET',
        path: `/devices/${id}`,
        params: {
          id: id
        }
      })
      req.deviceDb = fakeDb
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
      getDeviceSpy = jest.spyOn(deviceDiscovery.internal, '_getDevice')
    })

    afterEach(() => {
      getDeviceSpy.mockReset()
    })

    afterAll(() => {
      getDeviceSpy.mockRestore()
    })

    it('calls the getDevice internal function', (done) => {
      getDeviceSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(getDeviceSpy).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      deviceDiscovery.getDeviceRequestHandler(req, res)
    })

    it('calls the getDevice internal function with an id', (done) => {
      getDeviceSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(getDeviceSpy).toHaveBeenCalledWith(fakeDb, id)
          done()
        } catch (e) {
          done(e)
        }
      })

      deviceDiscovery.getDeviceRequestHandler(req, res)
    })

    describe('when the getDevice internal function succeeds', () => {
      it('returns 200', (done) => {
        getDeviceSpy.mockReturnValue(Promise.resolve())

        res.on('end', () => {
          try {
            expect(res._getStatusCode()).toEqual(200)
            done()
          } catch (e) {
            done(e)
          }
        })

        deviceDiscovery.getDeviceRequestHandler(req, res)
      })

      it('returns an object', (done) => {
        getDeviceSpy.mockReturnValue(Promise.resolve({}))

        res.on('end', () => {
          try {
            expect(res._getData()).toBeType('object')
            done()
          } catch (e) {
            done(e)
          }
        })

        deviceDiscovery.getDeviceRequestHandler(req, res)
      })
    })

    describe('when the getDevice internal function fails', () => {
      describe('with a 400', () => {
        it('returns 400', (done) => {
          const error = {
            statusCode: 400,
            message: 'bad request'
          }
          getDeviceSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(400)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.getDeviceRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            message: 'bad request',
            statusCode: 400
          }
          getDeviceSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toEqual(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.getDeviceRequestHandler(req, res)
        })
      })

      describe('with a 404', () => {
        it('returns a 404', (done) => {
          const error = {
            statusCode: 404,
            message: 'not found'
          }
          getDeviceSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(404)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.getDeviceRequestHandler(req, res)
        })

        it('returns an error in the body', (done) => {
          const error = {
            statusCode: 404,
            message: 'not found'
          }
          getDeviceSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toEqual(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.getDeviceRequestHandler(req, res)
        })
      })

      describe('with an unexpected error', () => {
        it('returns a 500', (done) => {
          const error = {
            statusCode: 500,
            message: 'internal server error'
          }
          getDeviceSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(500)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.getDeviceRequestHandler(req, res)
        })

        it('returns an error in the body', (done) => {
          const error = {
            statusCode: 500,
            message: 'internal server error'
          }
          getDeviceSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toEqual(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.getDeviceRequestHandler(req, res)
        })
      })
    })
  })

  describe('updateDeviceRequestHandler', () => {
    let req
    let res
    let updateDeviceSpy

    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'PUT',
        path: '/devices/1234',
        params: {
          id: '1234'
        },
        body: {
          device: {
            serialNum: 'OTRV-1a2b3c4d5e',
            author: '1a2b3c4d'
          }
        }
      })
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
      updateDeviceSpy = jest.spyOn(deviceDiscovery.internal, '_updateDevice')
    })

    afterEach(() => {
      updateDeviceSpy.mockReset()
    })

    afterAll(() => {
      updateDeviceSpy.mockRestore()
    })

    it('calls the _updateDevice internal function', (done) => {
      updateDeviceSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(updateDeviceSpy).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      deviceDiscovery.updateDeviceRequestHandler(req, res)
    })

    describe('when the _updateDevice internal function succeeds', () => {
      beforeEach(() => {
        updateDeviceSpy.mockReturnValue(Promise.resolve())
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

        deviceDiscovery.updateDeviceRequestHandler(req, res)
      })
    })

    describe('when the _updateDevice internal function fails', () => {
      describe('with a 400', () => {
        it('returns a 400', (done) => {
          const error = {
            statusCode: 400,
            message: 'bad request'
          }
          updateDeviceSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(400)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.updateDeviceRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            statusCode: 400,
            message: 'bad request'
          }
          updateDeviceSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.updateDeviceRequestHandler(req, res)
        })
      })

      describe('with a 409', () => {
        it('returns a 409', (done) => {
          const error = {
            statusCode: 409,
            message: 'conflict'
          }
          updateDeviceSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(409)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.updateDeviceRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            statusCode: 409,
            message: 'conflict'
          }
          updateDeviceSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.updateDeviceRequestHandler(req, res)
        })
      })

      describe('with an unexpected error', () => {
        it('returns a 500', (done) => {
          const error = {
            statusCode: 500,
            message: 'internal server error'
          }
          updateDeviceSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(500)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.updateDeviceRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            statusCode: 500,
            message: 'internal server error'
          }
          updateDeviceSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toBe(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.updateDeviceRequestHandler(req, res)
        })
      })
    })
  })

  describe('deleteDeviceRequestHandler', () => {
    let deleteDeviceSpy
    let req
    let res
    let id = '1234'

    const fakeDb = {}

    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'GET',
        path: `/devices/${id}`,
        params: {
          id: id
        }
      })
      req.deviceDb = fakeDb
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
      deleteDeviceSpy = jest.spyOn(deviceDiscovery.internal, '_deleteDevice')
    })

    afterEach(() => {
      deleteDeviceSpy.mockReset()
    })

    afterAll(() => {
      deleteDeviceSpy.mockRestore()
    })

    it('calls the deleteDevice internal function', (done) => {
      deleteDeviceSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(deleteDeviceSpy).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      deviceDiscovery.deleteDeviceRequestHandler(req, res)
    })

    it('calls the deleteDevice internal function with an id', (done) => {
      deleteDeviceSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(deleteDeviceSpy).toHaveBeenCalledWith(fakeDb, id)
          done()
        } catch (e) {
          done(e)
        }
      })

      deviceDiscovery.deleteDeviceRequestHandler(req, res)
    })

    describe('when the deleteDevice internal function succeeds', () => {
      it('returns 204', (done) => {
        deleteDeviceSpy.mockReturnValue(Promise.resolve())

        res.on('end', () => {
          try {
            expect(res._getStatusCode()).toEqual(204)
            done()
          } catch (e) {
            done(e)
          }
        })

        deviceDiscovery.deleteDeviceRequestHandler(req, res)
      })
    })

    describe('when the deleteDevice internal function fails', () => {
      describe('with a 400', () => {
        it('returns 400', (done) => {
          const error = {
            statusCode: 400,
            message: 'bad request'
          }
          deleteDeviceSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(400)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.deleteDeviceRequestHandler(req, res)
        })

        it('returns the error in the body', (done) => {
          const error = {
            message: 'bad request',
            statusCode: 400
          }
          deleteDeviceSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toEqual(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.deleteDeviceRequestHandler(req, res)
        })
      })

      describe('with a 404', () => {
        it('returns a 404', (done) => {
          const error = {
            statusCode: 404,
            message: 'not found'
          }
          deleteDeviceSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(404)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.deleteDeviceRequestHandler(req, res)
        })

        it('returns an error in the body', (done) => {
          const error = {
            statusCode: 404,
            message: 'not found'
          }
          deleteDeviceSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toEqual(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.deleteDeviceRequestHandler(req, res)
        })
      })

      describe('with an unexpected error', () => {
        it('returns a 500', (done) => {
          const error = {
            statusCode: 500,
            message: 'internal server error'
          }
          deleteDeviceSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(500)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.deleteDeviceRequestHandler(req, res)
        })

        it('returns an error in the body', (done) => {
          const error = {
            statusCode: 500,
            message: 'internal server error'
          }
          deleteDeviceSpy.mockReturnValue(Promise.reject(error))

          res.on('end', () => {
            try {
              expect(res._getData()).toEqual(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          deviceDiscovery.deleteDeviceRequestHandler(req, res)
        })
      })
    })
  })

  describe('internal functions', () => {
    // URL for  the Gateway
    const GATEWAY_URL = 'http://localhost:3002'

    describe('_createDevices', () => {
      describe('when the devices array is undefined', () => {
        it('returns a 400 error', () => {
          expect.assertions(1)
          return deviceDiscovery.internal._createDevices()
            .catch(error => {
              expect(error.statusCode).toEqual(400)
            })
        })
      })

      describe('when the devices array is empty', () => {
        it('returns a resolved promise', () => {
          return expect(deviceDiscovery.internal._createDevices([]))
            .resolves.toEqual([])
        })
      })

      describe('when the devices array is not empty', () => {
        let count
        let postNock

        beforeEach(() => {
          nock.cleanAll()
          count = 0

          postNock = nock(GATEWAY_URL)
            .persist()
            .post('/api/v1/trv', {})
            .reply(201, function () {
              count += 1
            })
        })

        afterEach(() => {
          postNock.persist(false)
        })

        it('makes a POST request to the gateway for the number of devices', () => {
          const devices = [{}, {}, {}, {}]
          return deviceDiscovery.internal._createDevices(devices)
            .then(() => {
              expect(count).toEqual(devices.length)
            })
        })
      })
    })

    describe('_discoverAllDevices', () => {
      it('calls GET /trv on the gateway function', () => {
        let count = 0
        nock(GATEWAY_URL)
          .get('/api/v1/trv')
          .reply(200, function () {
            count += 1
            return []
          })

        deviceDiscovery.internal._setFirstTimeCalled(true)
        return deviceDiscovery.internal._discoverAllDevices()
          .then(() => {
            expect(count).toEqual(1)
            nock.cleanAll()
          })
      })

      describe('when getAllDevices returns an empty array', () => {
        describe('and firstTimeCalled is true', () => {
          beforeEach(() => {
            deviceDiscovery.internal._setFirstTimeCalled(true)
          })

          it('returns a resolved promise with an empty array in the body', () => {
            nock(GATEWAY_URL)
              .get('/api/v1/trv')
              .reply(200, [])

            return deviceDiscovery.internal._discoverAllDevices()
              .then(result => {
                expect(result).toBeType('array')
                nock.cleanAll()
              })
          })
        })

        describe('and userFlag is true', () => {
          let mathRandomSpy
          let createDevicesSpy
          let discoverAllDevicesSpy

          beforeEach(() => {
            deviceDiscovery.internal._setFirstTimeCalled(false)
            mathRandomSpy = jest.spyOn(Math, 'random')
            discoverAllDevicesSpy = jest.spyOn(deviceDiscovery.internal, '_discoverAllDevices')
            createDevicesSpy = jest.spyOn(deviceDiscovery.internal, '_createDevices').mockImplementation(devices => {
              discoverAllDevicesSpy.mockReturnValue(Promise.resolve(devices))
              return Promise.resolve(devices)
            })
          })

          afterEach(() => {
            mathRandomSpy.mockReset()
            mathRandomSpy.mockRestore()
            createDevicesSpy.mockReset()
            createDevicesSpy.mockRestore()
            discoverAllDevicesSpy.mockReset()
            discoverAllDevicesSpy.mockRestore()
            nock.cleanAll()
          })

          it('returns a random number of devices', () => {
            mathRandomSpy.mockReturnValue(1)

            nock(GATEWAY_URL)
              .get('/api/v1/trv')
              .reply(200, [])

            return deviceDiscovery.internal._discoverAllDevices('yes')
              .then(result => {
                expect(result.length).toEqual(10)
              })
          })

          it('calls the createDevice internal function', () => {
            mathRandomSpy.mockReturnValue(1)

            nock(GATEWAY_URL)
              .get('/api/v1/trv')
              .reply(200, [])

            return deviceDiscovery.internal._discoverAllDevices('yes')
              .then(() => {
                expect(createDevicesSpy).toHaveBeenCalledTimes(1)
              })
          })
        })

        describe('when none of the above conditions are met', () => {
          it('returns a resolved promise with an empty array in the body', () => {
            deviceDiscovery.internal._setFirstTimeCalled(false)

            nock(GATEWAY_URL)
              .get('/api/v1/trv')
              .reply(200, [])

            return deviceDiscovery.internal._discoverAllDevices('no')
              .then(devices => {
                expect(devices.length).toEqual(0)
              })
          })
        })

        describe('when getAllDevices returns a rejected promise', () => {
          it('returns a rejected promise in the error of the body', () => {
            expect.assertions(1)

            nock(GATEWAY_URL)
              .get('/api/v1/trv')
              .replyWithError('Bang!')

            return deviceDiscovery.internal._discoverAllDevices('no')
              .catch(error => {
                expect(error.message).toEqual('Error: Bang!')
              })
          })
        })
      })

      describe('when getAllDevices returns an array of devices', () => {
        it('returns a resolved promise with the array of devices in the body', () => {
          let arrayOfDevices = [{
            id: '1',
            temp: 23
          }, {
            id: '2',
            temp: 26
          }, {
            id: '3',
            temp: 19
          }]

          nock(GATEWAY_URL)
              .get('/api/v1/trv')
              .reply(200, arrayOfDevices)

          return deviceDiscovery.internal._discoverAllDevices()
            .then(result => {
              expect(result.length).toEqual(arrayOfDevices.length)
            })
        })
      })
    })

    describe('_getDevice', () => {
      let getDeviceInformationSpy
      let fakeDatabase

      beforeEach(() => {
        fakeDatabase = {
          getDeviceInformation: () => {}
        }
        getDeviceInformationSpy = jest.spyOn(fakeDatabase, 'getDeviceInformation')
      })

      afterEach(() => {
        getDeviceInformationSpy.mockReset()
        getDeviceInformationSpy.mockRestore()
      })

      it('calls the getDeviceInformation method', () => {
        getDeviceInformationSpy.mockReturnValue(Promise.resolve())
        return deviceDiscovery.internal._getDevice(fakeDatabase, '1234')
          .then(() => {
            expect(getDeviceInformationSpy).toHaveBeenCalledTimes(1)
          })
      })

      describe('when the getDeviceInformation returns a resolved promise with some contents', () => {
        beforeEach(() => {
          getDeviceInformationSpy.mockReturnValue(Promise.resolve({content: 'some content'}))
        })

        it('returns the resolved promise with the content', () => {
          return deviceDiscovery.internal._getDevice(fakeDatabase, '1234')
            .then(data => {
              expect(data).toBeType('object')
            })
        })
      })

      describe('when the getDeviceInformation returns a rejected promise with an error in the body', () => {
        beforeEach(() => {
          getDeviceInformationSpy.mockReturnValue(Promise.reject(new Error('bang')))
        })

        it('returns the error in the body of the rejected promise', () => {
          expect.assertions(1)
          return deviceDiscovery.internal._getDevice(fakeDatabase, '1234')
            .catch(error => {
              expect(error.message).toEqual('bang')
            })
        })
      })
    })

    describe('_updateDevice', () => {
      let updateDeviceSpy
      let fakeDatabase

      beforeEach(() => {
        fakeDatabase = {
          updateDevice: () => {}
        }
        updateDeviceSpy = jest.spyOn(fakeDatabase, 'updateDevice')
      })

      afterEach(() => {
        updateDeviceSpy.mockReset()
        updateDeviceSpy.mockRestore()
      })

      it('calls the updateDevice method', () => {
        updateDeviceSpy.mockReturnValue(Promise.resolve())
        return deviceDiscovery.internal._updateDevice(fakeDatabase, {content: 'some content'})
          .then(() => {
            expect(updateDeviceSpy).toHaveBeenCalledTimes(1)
          })
      })

      describe('when the updateDevice method returns a resolved promise', () => {
        beforeEach(() => {
          updateDeviceSpy.mockReturnValue(Promise.resolve({content: 'some content'}))
        })

        it('returns the resolved promise', () => {
          return deviceDiscovery.internal._updateDevice(fakeDatabase, {content: 'some content'})
        })
      })

      describe('when the updateDevice method returns a rejected promise with an error in the body', () => {
        beforeEach(() => {
          updateDeviceSpy.mockReturnValue(Promise.reject(new Error('bang')))
        })

        it('returns the error in the body of the rejected promise', () => {
          expect.assertions(1)
          return deviceDiscovery.internal._updateDevice(fakeDatabase, {content: 'bad content'})
            .catch(error => {
              expect(error.message).toEqual('bang')
            })
        })
      })
    })

    describe('_deleteDevice', () => {
      let deleteDeviceSpy
      let fakeDatabase

      beforeEach(() => {
        fakeDatabase = {
          deleteDevice: () => {}
        }
        deleteDeviceSpy = jest.spyOn(fakeDatabase, 'deleteDevice')
      })

      afterEach(() => {
        deleteDeviceSpy.mockReset()
        deleteDeviceSpy.mockRestore()
      })

      it('calls the deleteDevice method', () => {
        deleteDeviceSpy.mockReturnValue(Promise.resolve())
        return deviceDiscovery.internal._deleteDevice(fakeDatabase, '1234')
          .then(() => {
            expect(deleteDeviceSpy).toHaveBeenCalledTimes(1)
          })
      })

      describe('when the deleteDevice method returns a resolved promise', () => {
        beforeEach(() => {
          deleteDeviceSpy.mockReturnValue(Promise.resolve({content: 'some content'}))
        })

        it('returns the resolved promise', () => {
          return deviceDiscovery.internal._deleteDevice(fakeDatabase, '1234')
        })
      })

      describe('when the deleteDevice method returns a rejected promise with an error in the body', () => {
        beforeEach(() => {
          deleteDeviceSpy.mockReturnValue(Promise.reject(new Error('bang')))
        })

        it('returns the error in the body of the rejected promise', () => {
          expect.assertions(1)
          return deviceDiscovery.internal._deleteDevice(fakeDatabase, '1234')
            .catch(error => {
              expect(error.message).toEqual('bang')
            })
        })
      })
    })

    describe('_generateSerialId', () => {
      let mathRandomSpy

      beforeEach(() => {
        mathRandomSpy = jest.spyOn(Math, 'random')
      })

      afterEach(() => {
        mathRandomSpy.mockReset()
      })

      afterAll(() => {
        mathRandomSpy.mockRestore()
      })

      it('returns a string', () => {
        const serialId = deviceDiscovery.internal._generateSerialId()
        expect(serialId).toBeType('string')
      })

      it('returns a string 15 characters long', () => {
        const serialId = deviceDiscovery.internal._generateSerialId()
        expect(serialId.length).toEqual(15)
      })

      it('returns a string with OTRV- at the start', () => {
        const serialId = deviceDiscovery.internal._generateSerialId()
        expect(serialId.startsWith('OTRV-')).toBe(true)
      })

      it('calls math.random 10 times', () => {
        deviceDiscovery.internal._generateSerialId()
        expect(mathRandomSpy).toHaveBeenCalledTimes(10)
      })
    })

    describe('_roundToOneDP', () => {
      it('rounds the number passed in to 1 decimal place', () => {
        const number = deviceDiscovery.internal._roundToOneDP(12.3456789)
        expect(number).toEqual(12.3)
      })
    })
  })
})

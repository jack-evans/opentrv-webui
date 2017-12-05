'use strict'

import toBeType from 'jest-tobetype'

const httpMocks = require('node-mocks-http')
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
    let saveDeviceBasicInformationSpy

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
      saveDeviceBasicInformationSpy = jest.spyOn(deviceDiscovery.internal, '_saveDeviceBasicInformation')
    })

    afterEach(() => {
      saveDeviceBasicInformationSpy.mockReset()
    })

    it('calls the saveDeviceBasicInformation internal function', (done) => {
      saveDeviceBasicInformationSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(saveDeviceBasicInformationSpy).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      deviceDiscovery.createDeviceRequestHandler(req, res)
    })

    describe('when the saveDeviceBasicInformation internal function succeeds', () => {
      beforeEach(() => {
        saveDeviceBasicInformationSpy.mockReturnValue(Promise.resolve())
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

  describe('internal functions', () => {
    describe('_discoverAllDevices', () => {
      it('returns a resolved promise', () => {
        return deviceDiscovery.internal._discoverAllDevices()
          .then(() => {
            expect(1).toEqual(1)
          })
      })

      it('returns an array in the resolved promise', () => {
        return deviceDiscovery.internal._discoverAllDevices()
          .then(result => {
            expect(result).toBeType('array')
          })
      })

      it('returns an array containing objects in the resolved promise', () => {
        expect.assertions(5)
        return deviceDiscovery.internal._discoverAllDevices()
          .then(result => {
            for (let i = 0; i < result.length; i++) {
              expect(result[i]).toBeType('object')
            }
          })
      })
    })
  })
})

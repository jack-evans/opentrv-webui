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

  describe.only('discoverAllDevicesRequestHandler', () => {
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
      beforeEach(() => {
        discoverAllDevicesSpy.mockReturnValue(Promise.resolve())
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
  })

  describe('internal functions', () => {

  })
})

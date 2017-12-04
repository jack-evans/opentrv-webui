'use strict'

const httpMocks = require('node-mocks-http')
import toBeType from 'jest-tobetype'
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
        expect(discoverAllDevicesSpy).toHaveBeenCalledTimes(1)
        done()
      })

      deviceDiscovery.discoverAllDevicesRequestHandler(req, res)
    })

    describe('when the discoverAllDevices internal function succeeds', () => {
      let saveDeviceBasicInformationSpy

      beforeEach(() => {
        saveDeviceBasicInformationSpy = jest.spyOn(deviceDiscovery.internal, '_saveDeviceBasicInformation')
      })

      afterEach(() => {
        saveDeviceBasicInformationSpy.mockReset()
        saveDeviceBasicInformationSpy.mockRestore()
      })

      it('calls the _saveDeviceBasicInformation internal function', (done) => {
        discoverAllDevicesSpy.mockReturnValue(Promise.resolve())
        saveDeviceBasicInformationSpy.mockReturnValue(Promise.resolve())

        res.on('end', () => {
          expect(saveDeviceBasicInformationSpy).toHaveBeenCalledTimes(1)
          done()
        })

        deviceDiscovery.discoverAllDevicesRequestHandler(req, res)
      })

      it('calls the _saveDeviceBasicInformation internal function with the result from ')
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
            expect(res._getStatusCode()).toEqual(400)
            done()
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
          expect(res._getData()).toEqual(error)
          done()
        })

        deviceDiscovery.discoverAllDevicesRequestHandler(req, res)
      })
    })
  })

  describe('internal functions', () => {

  })
})

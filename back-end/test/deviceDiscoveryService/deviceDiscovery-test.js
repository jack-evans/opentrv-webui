'use strict'

import toBeType from 'jest-tobetype'

const httpMocks = require('node-mocks-http')
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

    afterAll(() => {
      saveDeviceBasicInformationSpy.mockRestore()
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

    describe('when the saveDeviceBasicInformation internal function fails', () => {
      describe('with a 400', () => {
        it('returns a 400', (done) => {
          const error = {
            statusCode: 400,
            message: 'bad request'
          }
          saveDeviceBasicInformationSpy.mockReturnValue(Promise.reject(error))

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
          saveDeviceBasicInformationSpy.mockReturnValue(Promise.reject(error))

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
          saveDeviceBasicInformationSpy.mockReturnValue(Promise.reject(error))

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
          saveDeviceBasicInformationSpy.mockReturnValue(Promise.reject(error))

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

      describe('with an unexpeccted error', () => {
        it('returns a 500', (done) => {
          const error = {
            statusCode: 500,
            message: 'internal server error'
          }
          saveDeviceBasicInformationSpy.mockReturnValue(Promise.reject(error))

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
          saveDeviceBasicInformationSpy.mockReturnValue(Promise.reject(error))

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

  describe('internal functions', () => {
    describe('_saveDeviceBasicInformation', () => {
      describe('when the devices array is undefined', () => {
        it('returns a 400 error', () => {
          expect.assertions(1)
          return deviceDiscovery.internal._saveDeviceBasicInformation()
            .catch(error => {
              expect(error.statusCode).toEqual(400)
            })
        })
      })

      describe('when the devices array is empty', () => {
        it('returns a resolved promise', () => {
          return expect(deviceDiscovery.internal._saveDeviceBasicInformation(null, []))
            .resolves.toEqual([])
        })
      })

      describe('when the devices array is not empty', () => {
        let database
        let createDeviceSpy

        beforeEach(() => {
          database = {
            createDevice: () => {}
          }
          createDeviceSpy = jest.spyOn(database, 'createDevice').mockReturnValue(Promise.resolve())
        })

        afterEach(() => {
          createDeviceSpy.mockReset()
        })

        it('calls the createDevice method in the database for the number of devices', () => {
          const devices = [{}, {}, {}, {}]
          return deviceDiscovery.internal._saveDeviceBasicInformation(database, devices)
            .then(() => {
              expect(createDeviceSpy).toHaveBeenCalledTimes(devices.length)
            })
        })
      })
    })

    describe('_discoverAllDevices', () => {
      it('calls the getAllDevices database function', () => {
        let fakeDB = {
          getAllDevices: () => (Promise.resolve([]))
        }

        let getAllDevicesSpy = jest.spyOn(fakeDB, 'getAllDevices')

        deviceDiscovery.internal._setFirstTimeCalled(true)
        return deviceDiscovery.internal._discoverAllDevices(fakeDB)
          .then(() => {
            expect(getAllDevicesSpy).toHaveBeenCalledTimes(1)
            getAllDevicesSpy.mockReset()
            getAllDevicesSpy.mockRestore()
          })
      })

      describe('when getAllDevices returns an empty array', () => {
        describe('and firstTimeCalled is true', () => {
          beforeEach(() => {
            deviceDiscovery.internal._setFirstTimeCalled(true)
          })

          it('returns a resolved promise with an empty array in the body', () => {
            let fakeDB = {
              getAllDevices: () => (Promise.resolve([]))
            }

            return deviceDiscovery.internal._discoverAllDevices(fakeDB)
              .then(result => {
                expect(result).toBeType('array')
              })
          })
        })

        describe('and firstTimeCalled is false', () => {
          let mathRandomSpy

          beforeEach(() => {
            deviceDiscovery.internal._setFirstTimeCalled(false)
            mathRandomSpy = jest.spyOn(Math, 'random')
          })

          afterEach(() => {
            mathRandomSpy.mockReset()
          })

          it('returns a random number of devices', () => {
            mathRandomSpy.mockReturnValue(1)
            let fakeDB = {
              getAllDevices: () => (Promise.resolve([]))
            }

            return deviceDiscovery.internal._discoverAllDevices(fakeDB)
              .then(result => {
                expect(result.length).toEqual(10)
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

          let fakeDB = {
            getAllDevices: () => (Promise.resolve(arrayOfDevices))
          }

          return deviceDiscovery.internal._discoverAllDevices(fakeDB)
            .then(result => {
              expect(result.length).toEqual(arrayOfDevices.length)
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

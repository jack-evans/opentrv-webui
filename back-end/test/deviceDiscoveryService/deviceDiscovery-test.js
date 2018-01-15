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
          return expect(deviceDiscovery.internal._createDevices(null, []))
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
          return deviceDiscovery.internal._createDevices(database, devices)
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

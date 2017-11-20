'use strict'

const cloudantRequestHelper = require('../../lib/utilities/cloudantRequestHelper')
const DeviceDatabase = require('../../lib/deviceDiscoveryService/deviceDatabase')
const Promise = require('bluebird')

describe('deviceDatabase.js', () => {
  let createCloudantConnectionSpy
  let deviceDatabase

  beforeEach(() => {
    createCloudantConnectionSpy = jest.spyOn(cloudantRequestHelper, 'createCloudantConnection').mockReturnValue('SUCCESS')
  })

  afterEach(() => {
    createCloudantConnectionSpy.mockReset()
    createCloudantConnectionSpy.mockRestore()
  })

  describe('deviceDatabase constructor', () => {
    beforeEach(() => {
      deviceDatabase = new DeviceDatabase()
    })

    it('makes a call to authenticate with cloudant', () => {
      expect(createCloudantConnectionSpy).toHaveBeenCalledTimes(1)
    })

    it('sets the database property to undefined', () => {
      expect(deviceDatabase.database).toBe(undefined)
    })

    it('sets the initPromise property to undefined', () => {
      expect(deviceDatabase.initPromise).toBe(undefined)
    })
  })

  describe('deviceDatabase initialise method', () => {
    let createDatabaseSpy
    let useDatabaseSpy

    beforeEach(() => {
      createDatabaseSpy = jest.spyOn(cloudantRequestHelper, 'createDatabase').mockReturnValue(Promise.resolve({ok: true}))
      useDatabaseSpy = jest.spyOn(cloudantRequestHelper, 'useDatabase').mockReturnValue(Promise.resolve(42))
      deviceDatabase = new DeviceDatabase()
    })

    afterEach(() => {
      createDatabaseSpy.mockReset()
      createDatabaseSpy.mockRestore()
      useDatabaseSpy.mockReset()
      useDatabaseSpy.mockRestore()
    })

    it('makes a call to create a database in cloudant', () => {
      return deviceDatabase.initialise()
        .then(() => {
          expect(createDatabaseSpy).toHaveBeenCalledTimes(1)
        })
    })

    describe('when the call to create a database in cloudant is successful', () => {
      it('makes a call to set the database property of the device database', () => {
        return deviceDatabase.initialise()
          .then(() => {
            expect(useDatabaseSpy).toHaveBeenCalledTimes(1)
          })
      })
    })

    describe('when the call to create a database in cloudant is unsuccessful', () => {
      it('returns a rejected promise with the error in the body', () => {
        createDatabaseSpy.mockReturnValue(Promise.reject(new Error('Bang in the createDatabase function')))
        return deviceDatabase.initialise()
          .catch(error => {
            expect(error.message).toEqual('Bang in the createDatabase function')
          })
      })
    })
  })

  describe('deviceDatabase createDevice method', () => {
    let createDocumentSpy
    let id = '1234-abcd-5678-efgh'

    let deviceDocument = {
      serialNum: 'OTRV-1a2b3c4d5e',
      name: 'device 1'
    }

    const mockReturnValue = {
      serialNum: 'OTRV-1a2b3c4d5f',
      name: 'device 1',
      id: id,
      _id: id
    }
    beforeEach(() => {
      createDocumentSpy = jest.spyOn(cloudantRequestHelper, 'createDocument')
      deviceDatabase = new DeviceDatabase()
    })

    afterEach(() => {
      createDocumentSpy.mockReset()
      createDocumentSpy.mockRestore()
    })

    describe('when initPromise is a rejected promise', () => {
      beforeEach(() => {
        deviceDatabase.initPromise = Promise.reject(new Error('Bang!'))
      })

      it('does not call the createDocument function', () => {
        deviceDatabase.createDevice(deviceDocument)
          .catch(() => {
            expect(createDocumentSpy).toHaveBeenCalledTimes(0)
          })
      })

      it('returns a rejected promise', () => {
        return deviceDatabase.createDevice(deviceDocument)
          .catch(error => {
            expect(error.message).toEqual('Bang!')
          })
      })
    })

    describe('when initPromise is a resolved promise', () => {
      beforeEach(() => {
        deviceDatabase.initPromise = Promise.resolve()
      })

      it('calls the createDocument function', () => {
        createDocumentSpy.mockReturnValue(Promise.resolve(mockReturnValue))
        return deviceDatabase.createDevice(deviceDocument)
          .then(() => {
            expect(createDocumentSpy).toHaveBeenCalledTimes(1)
          })
      })

      describe('when createDocument returns a resolved promise with the document in the body', () => {
        it('returns a resolved promise with the document in the body', () => {
          createDocumentSpy.mockReturnValue(Promise.resolve(mockReturnValue))

          return deviceDatabase.createDevice(deviceDocument)
            .then(document => {
              expect(document).toEqual(mockReturnValue)
            })
        })
      })

      describe('when createDocument returns a rejected promise with the error in the body', () => {
        it('returns a rejected promise with the error in the body', () => {
          createDocumentSpy.mockReturnValue(Promise.reject(new Error('Bang in the createDevice method')))

          return deviceDatabase.createDevice(deviceDocument)
            .catch(error => {
              expect(error.message).toEqual('Bang in the createDevice method')
            })
        })
      })
    })
  })
})

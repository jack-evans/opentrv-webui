'use strict'

const cloudantRequestHelper = require('../../lib/utilities/cloudantRequestHelper')
const Promise = require('bluebird')

describe('policyManagementDatabase.js', () => {
  let createCloudantConnectionSpy
  let PolicyManagementDatabase
  let policyManagementDatabase

  beforeEach(() => {
    createCloudantConnectionSpy = jest.spyOn(cloudantRequestHelper, 'createCloudantConnection').mockReturnValue('SUCCESS')
    PolicyManagementDatabase = require('../../lib/policyManagementService/policyManagementDatabase')
  })

  afterEach(() => {
    createCloudantConnectionSpy.mockReset()
    delete require.cache[require.resolve('../../lib/deviceDiscoveryService/deviceDatabase')]
  })

  describe('policyManagementDatabase constructor', () => {
    beforeEach(() => {
      policyManagementDatabase = new PolicyManagementDatabase()
    })

    it('makes a call to authenticate with cloudant', () => {
      expect(createCloudantConnectionSpy).toHaveBeenCalledTimes(1)
    })

    it('sets the database property to undefined', () => {
      expect(policyManagementDatabase.database).toBe(undefined)
    })

    it('sets the initPromise property to undefined', () => {
      expect(policyManagementDatabase.initPromise).toBe(undefined)
    })
  })

  describe('policyManagementDatabase initialise method', () => {
    let createDatabaseSpy
    let useDatabaseSpy

    beforeEach(() => {
      createDatabaseSpy = jest.spyOn(cloudantRequestHelper, 'createDatabase').mockReturnValue(Promise.resolve({ok: true}))
      useDatabaseSpy = jest.spyOn(cloudantRequestHelper, 'useDatabase').mockReturnValue(Promise.resolve(42))
      policyManagementDatabase = new PolicyManagementDatabase()
    })

    afterEach(() => {
      createDatabaseSpy.mockReset()
      useDatabaseSpy.mockReset()
    })

    it('makes a call to create a database in cloudant', () => {
      return policyManagementDatabase.initialise()
        .then(() => {
          expect(createDatabaseSpy).toHaveBeenCalledTimes(1)
        })
    })

    describe('when the call to create a database in cloudant is successful', () => {
      it('makes a call to set the database property of the device database', () => {
        return policyManagementDatabase.initialise()
          .then(() => {
            expect(useDatabaseSpy).toHaveBeenCalledTimes(1)
          })
      })
    })

    describe('when the call to create a database in cloudant is unsuccessful', () => {
      it('returns a rejected promise with the error in the body', () => {
        createDatabaseSpy.mockReturnValue(Promise.reject(new Error('Bang in the createDatabase function')))
        expect.assertions(1)
        return policyManagementDatabase.initialise()
          .catch(error => {
            expect(error.message).toEqual('Bang in the createDatabase function')
          })
      })
    })
  })

  describe('policyManagementDatabase createPolicy method', () => {
    let createDocumentSpy
    let id = '1234-abcd-5678-efgh'

    let policyDocument = {
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
      policyManagementDatabase = new PolicyManagementDatabase()
    })

    afterEach(() => {
      createDocumentSpy.mockReset()
      createDocumentSpy.mockRestore()
    })

    describe('when initPromise is a rejected promise', () => {
      beforeEach(() => {
        policyManagementDatabase.initPromise = Promise.reject(new Error('Bang!'))
      })

      it('does not call the createDocument function', () => {
        expect.assertions(1)
        return policyManagementDatabase.createPolicy(policyDocument)
          .catch(() => {
            expect(createDocumentSpy).toHaveBeenCalledTimes(0)
          })
      })

      it('returns a rejected promise', () => {
        expect.assertions(1)
        return policyManagementDatabase.createPolicy(policyDocument)
          .catch(error => {
            expect(error.message).toEqual('Bang!')
          })
      })
    })

    describe('when initPromise is a resolved promise', () => {
      beforeEach(() => {
        policyManagementDatabase.initPromise = Promise.resolve()
      })

      it('calls the createDocument function', () => {
        createDocumentSpy.mockReturnValue(Promise.resolve(mockReturnValue))
        return policyManagementDatabase.createPolicy(policyDocument)
          .then(() => {
            expect(createDocumentSpy).toHaveBeenCalledTimes(1)
          })
      })

      describe('when createDocument resolves', () => {
        it('returns the document in the body of the resolved promise', () => {
          createDocumentSpy.mockReturnValue(Promise.resolve(mockReturnValue))

          return policyManagementDatabase.createPolicy(policyDocument)
            .then(document => {
              expect(document).toEqual(mockReturnValue)
            })
        })
      })

      describe('when createDocument rejects', () => {
        it('returns the error in the body of the rejected promise', () => {
          createDocumentSpy.mockReturnValue(Promise.reject(new Error('Bang in the createPolicy method')))
          expect.assertions(1)
          return policyManagementDatabase.createPolicy(policyDocument)
            .catch(error => {
              expect(error.message).toEqual('Bang in the createPolicy method')
            })
        })
      })
    })
  })

  describe('policyManagementDatabase getPolicy method', () => {
    let retrieveDocumentSpy

    beforeEach(() => {
      retrieveDocumentSpy = jest.spyOn(cloudantRequestHelper, 'retrieveDocument')
      policyManagementDatabase = new PolicyManagementDatabase()
    })

    afterEach(() => {
      retrieveDocumentSpy.mockReset()
      retrieveDocumentSpy.mockRestore()
    })

    describe('when initPromise is a rejected promise', () => {
      beforeEach(() => {
        policyManagementDatabase.initPromise = Promise.reject(new Error('Bang!'))
      })

      it('does not call the retrieveDocument function', () => {
        expect.assertions(1)
        return policyManagementDatabase.getPolicy('1234')
          .catch(() => {
            expect(retrieveDocumentSpy).toHaveBeenCalledTimes(0)
          })
      })

      it('returns a rejected promise', () => {
        expect.assertions(1)
        return policyManagementDatabase.getPolicy('1234')
          .catch(error => {
            expect(error.message).toEqual('Bang!')
          })
      })
    })

    describe('when initPromise is a resolved promise', () => {
      let id = '1234-abcd-5678-efgh'

      const mockReturnValue = {
        serialNum: 'OTRV-1a2b3c4d5f',
        name: 'device 1',
        id: id,
        _id: id
      }

      beforeEach(() => {
        policyManagementDatabase.initPromise = Promise.resolve()
      })

      it('calls the retrieveDocument function', () => {
        retrieveDocumentSpy.mockReturnValue(Promise.resolve(mockReturnValue))
        return policyManagementDatabase.getPolicy(id)
          .then(() => {
            expect(retrieveDocumentSpy).toHaveBeenCalledTimes(1)
          })
      })

      describe('when retrieveDocument resolves', () => {
        it('returns the document in the body of the resolved promise', () => {
          retrieveDocumentSpy.mockReturnValue(Promise.resolve(mockReturnValue))

          return policyManagementDatabase.getPolicy(id)
            .then(document => {
              expect(document).toEqual(mockReturnValue)
            })
        })
      })

      describe('when retrieveDocument rejects', () => {
        it('returns the error in the body of the rejected promise', () => {
          retrieveDocumentSpy.mockReturnValue(Promise.reject(new Error('Bang in the getPolicy method')))
          expect.assertions(1)
          return policyManagementDatabase.getPolicy(id)
            .catch(error => {
              expect(error.message).toEqual('Bang in the getPolicy method')
            })
        })
      })
    })
  })

  describe.skip('policyManagementDatabase getAllPolicies method', () => {
    let retrieveAllDocumentsSpy

    beforeEach(() => {
      retrieveAllDocumentsSpy = jest.spyOn(cloudantRequestHelper, 'retrieveAllDocuments')
      policyManagementDatabase = new PolicyManagementDatabase()
    })

    afterEach(() => {
      retrieveAllDocumentsSpy.mockReset()
      retrieveAllDocumentsSpy.mockRestore()
    })

    describe('when initPromise is a rejected promise', () => {
      beforeEach(() => {
        policyManagementDatabase.initPromise = Promise.reject(new Error('Bang!'))
      })

      it('does not call the retrieveAllDocuments function', () => {
        expect.assertions(1)
        return policyManagementDatabase.getAllPolicies()
          .catch(() => {
            expect(retrieveAllDocumentsSpy).toHaveBeenCalledTimes(0)
          })
      })

      it('returns a rejected promise', () => {
        expect.assertions(1)
        return policyManagementDatabase.getAllPolicies()
          .catch(error => {
            expect(error.message).toEqual('Bang!')
          })
      })
    })

    describe('when initPromise is a resolved promise', () => {
      let id = '1234-abcd-5678-efgh'

      const mockReturnValue = [{
        serialNum: 'OTRV-1a2b3c4d5f',
        name: 'device 1',
        id: id,
        _id: id
      }]

      beforeEach(() => {
        policyManagementDatabase.initPromise = Promise.resolve()
      })

      it('calls the retrieveAllDocuments function', () => {
        retrieveAllDocumentsSpy.mockReturnValue(Promise.resolve(mockReturnValue))
        return policyManagementDatabase.getAllPolicies()
          .then(() => {
            expect(retrieveAllDocumentsSpy).toHaveBeenCalledTimes(1)
          })
      })

      describe('when retrieveAllDocuments resolves', () => {
        it('returns the array of documents in the body of the resolved promise', () => {
          retrieveAllDocumentsSpy.mockReturnValue(Promise.resolve(mockReturnValue))

          return policyManagementDatabase.getAllPolicies()
            .then(document => {
              expect(document).toEqual(mockReturnValue)
            })
        })
      })

      describe('when retrieveAllDocuments rejects', () => {
        it('returns the error in the body of the rejected promise', () => {
          retrieveAllDocumentsSpy.mockReturnValue(Promise.reject(new Error('Bang in the getAllPolicies method')))
          expect.assertions(1)
          return policyManagementDatabase.getAllPolicies()
            .catch(error => {
              expect(error.message).toEqual('Bang in the getAllPolicies method')
            })
        })
      })
    })
  })

  describe('policyManagementDatabase updatePolicies method', () => {
    let updateDocumentSpy

    let newDeviceDocument = {
      serialNum: 'OTRV-1a2b3c4d5e',
      name: 'Living room'
    }

    beforeEach(() => {
      updateDocumentSpy = jest.spyOn(cloudantRequestHelper, 'updateDocument')
      policyManagementDatabase = new PolicyManagementDatabase()
    })

    afterEach(() => {
      updateDocumentSpy.mockReset()
      updateDocumentSpy.mockRestore()
    })

    describe('when initPromise is a rejected promise', () => {
      beforeEach(() => {
        policyManagementDatabase.initPromise = Promise.reject(new Error('Bang!'))
      })

      it('does not call the updateDevice method', () => {
        expect.assertions(1)
        return policyManagementDatabase.updatePolicy(newDeviceDocument)
          .catch(() => {
            expect(updateDocumentSpy).not.toHaveBeenCalled()
          })
      })

      it('returns a rejected promise with an error in the body', () => {
        expect.assertions(1)
        return policyManagementDatabase.updatePolicy(newDeviceDocument)
          .catch(error => {
            expect(error.message).toEqual('Bang!')
          })
      })
    })

    describe('when initPromise is a resolved promise', () => {
      beforeEach(() => {
        policyManagementDatabase.initPromise = Promise.resolve()
      })

      it('calls the updateDocument function', () => {
        updateDocumentSpy.mockReturnValue(Promise.resolve())
        return policyManagementDatabase.updatePolicy(newDeviceDocument)
          .then(() => {
            expect(updateDocumentSpy).toHaveBeenCalledTimes(1)
          })
      })

      describe('when updateDocument resolves', () => {
        it('returns a resolved promise', () => {
          updateDocumentSpy.mockReturnValue(Promise.resolve())

          return policyManagementDatabase.updatePolicy(newDeviceDocument)
        })
      })

      describe('when updateDocument rejects', () => {
        it('returns the error in the body of the rejected promise', () => {
          updateDocumentSpy.mockReturnValue(Promise.reject(new Error('Bang in the updatePolicy method')))
          expect.assertions(1)
          return policyManagementDatabase.updatePolicy(newDeviceDocument)
            .catch(error => {
              expect(error.message).toEqual('Bang in the updatePolicy method')
            })
        })
      })
    })
  })

  describe('policyManagementDatabase deletePolicy method', () => {
    let deleteDocumentSpy
    let id = '1234-abcd-5678-efgh'

    beforeEach(() => {
      deleteDocumentSpy = jest.spyOn(cloudantRequestHelper, 'deleteDocument')
      policyManagementDatabase = new PolicyManagementDatabase()
    })

    afterEach(() => {
      deleteDocumentSpy.mockReset()
      deleteDocumentSpy.mockRestore()
    })

    describe('when initPromise is a rejected promise', () => {
      beforeEach(() => {
        policyManagementDatabase.initPromise = Promise.reject(new Error('Bang!'))
      })

      it('does not call the deleteDocument function', () => {
        expect.assertions(1)
        return policyManagementDatabase.deletePolicy(id)
          .catch(() => {
            expect(deleteDocumentSpy).not.toHaveBeenCalled()
          })
      })

      it('returns a rejected promise with the error in the body', () => {
        expect.assertions(1)
        return policyManagementDatabase.deletePolicy(id)
          .catch(error => {
            expect(error.message).toEqual('Bang!')
          })
      })
    })

    describe('when initPromise is a resolved promise', () => {
      beforeEach(() => {
        policyManagementDatabase.initPromise = Promise.resolve()
      })

      it('calls the deleteDocument function', () => {
        deleteDocumentSpy.mockReturnValue(Promise.resolve())
        return policyManagementDatabase.deletePolicy(id)
          .then(() => {
            expect(deleteDocumentSpy).toHaveBeenCalledTimes(1)
          })
      })

      describe('when deleteDocument resolves', () => {
        it('returns a resolved promise', () => {
          deleteDocumentSpy.mockReturnValue(Promise.resolve())

          return policyManagementDatabase.deletePolicy(id)
        })
      })

      describe('when deleteDocument rejects', () => {
        it('returns the error in the body of the rejected promise', () => {
          deleteDocumentSpy.mockReturnValue(Promise.reject(new Error('Bang in the deleteDevice method')))
          expect.assertions(1)
          return policyManagementDatabase.deletePolicy(id)
            .catch(error => {
              expect(error.message).toEqual('Bang in the deleteDevice method')
            })
        })
      })
    })
  })
})

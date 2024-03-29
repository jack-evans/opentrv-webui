'use strict'

const cloudantRequestHelper = require('../../lib/utilities/cloudantRequestHelper')
const Promise = require('bluebird')

describe('userDatabase.js', () => {
  let createCloudantConnectionSpy
  let UserDatabase
  let userDatabase

  beforeEach(() => {
    createCloudantConnectionSpy = jest.spyOn(cloudantRequestHelper, 'createCloudantConnection').mockReturnValue('SUCCESS')
    UserDatabase = require('../../lib/userService/userDatabase')
  })

  afterEach(() => {
    createCloudantConnectionSpy.mockReset()
    delete require.cache[require.resolve('../../lib/userService/userDatabase')]
  })

  describe('userDatabase constructor', () => {
    beforeEach(() => {
      userDatabase = new UserDatabase()
    })

    it('makes a call to authenticate with cloudant', () => {
      expect(createCloudantConnectionSpy).toHaveBeenCalledTimes(1)
    })

    it('sets the database property to undefined', () => {
      expect(userDatabase.database).toBe(undefined)
    })

    it('sets the initPromise property to undefined', () => {
      expect(userDatabase.initPromise).toBe(undefined)
    })
  })

  describe('userDatabase initialise method', () => {
    let createDatabaseSpy
    let useDatabaseSpy
    let createIndexSpy

    beforeEach(() => {
      createDatabaseSpy = jest.spyOn(cloudantRequestHelper, 'createDatabase').mockReturnValue(Promise.resolve({ok: true}))
      useDatabaseSpy = jest.spyOn(cloudantRequestHelper, 'useDatabase').mockReturnValue(Promise.resolve(42))
      createIndexSpy = jest.spyOn(cloudantRequestHelper, 'createIndex').mockReturnValue(Promise.resolve())
      userDatabase = new UserDatabase()
    })

    afterEach(() => {
      createDatabaseSpy.mockReset()
      useDatabaseSpy.mockReset()
      createIndexSpy.mockReset()
    })

    it('makes a call to create a database in cloudant', () => {
      return userDatabase.initialise()
        .then(() => {
          expect(createDatabaseSpy).toHaveBeenCalledTimes(1)
        })
    })

    describe('when the call to create a database in cloudant is successful', () => {
      it('makes a call to set the database property of the user database', () => {
        return userDatabase.initialise()
          .then(() => {
            expect(useDatabaseSpy).toHaveBeenCalledTimes(1)
          })
      })

      it('calls the creatIndex function', () => {
        return userDatabase.initialise()
          .then(() => {
            expect(createIndexSpy).toHaveBeenCalledTimes(1)
          })
      })
    })

    describe('when the call to create a database in cloudant is unsuccessful', () => {
      it('returns a rejected promise with the error in the body', () => {
        createDatabaseSpy.mockReturnValue(Promise.reject(new Error('Bang in the createDatabase function')))
        expect.assertions(1)
        return userDatabase.initialise()
          .catch(error => {
            expect(error.message).toEqual('Bang in the createDatabase function')
          })
      })
    })
  })

  describe('userDatabase createUser method', () => {
    let createDocumentSpy
    const id = '1234-abcd-5678-efgh'

    const userDocument = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    }

    const mockReturnValue = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      id: id,
      _id: id
    }

    beforeEach(() => {
      createDocumentSpy = jest.spyOn(cloudantRequestHelper, 'createDocument')
      userDatabase = new UserDatabase()
    })

    afterEach(() => {
      createDocumentSpy.mockReset()
      createDocumentSpy.mockRestore()
    })

    describe('when initPromise is a rejected promise', () => {
      beforeEach(() => {
        userDatabase.initPromise = Promise.reject(new Error('Bang!'))
      })

      it('does not call the createDocument function', () => {
        expect.assertions(1)
        return userDatabase.createUser(userDocument)
          .catch(() => {
            expect(createDocumentSpy).toHaveBeenCalledTimes(0)
          })
      })

      it('returns the rejected promise', () => {
        expect.assertions(1)
        return userDatabase.createUser(userDocument)
          .catch(error => {
            expect(error.message).toEqual('Bang!')
          })
      })
    })

    describe('when initPromise is a resolved promise', () => {
      beforeEach(() => {
        userDatabase.initPromise = Promise.resolve()
      })

      it('calls the createDocument function', () => {
        createDocumentSpy.mockReturnValue(Promise.resolve(mockReturnValue))
        return userDatabase.createUser(userDocument)
          .then(() => {
            expect(createDocumentSpy).toHaveBeenCalledTimes(1)
          })
      })

      describe('when createDocument resolves', () => {
        it('returns the document in the body of the resolved promise', () => {
          createDocumentSpy.mockReturnValue(Promise.resolve(mockReturnValue))

          return userDatabase.createUser(userDocument)
            .then(document => {
              expect(document).toEqual(mockReturnValue)
            })
        })
      })

      describe('when createDocument rejects', () => {
        it('returns the error in the body of the rejected promise', () => {
          createDocumentSpy.mockReturnValue(Promise.reject(new Error('Bang in the createDevice method')))
          expect.assertions(1)
          return userDatabase.createUser(userDocument)
            .catch(error => {
              expect(error.message).toEqual('Bang in the createDevice method')
            })
        })
      })
    })
  })

  describe('userDatabase getAllUsers method', () => {
    let retrieveAllDocumentsSpy

    beforeEach(() => {
      retrieveAllDocumentsSpy = jest.spyOn(cloudantRequestHelper, 'retrieveAllDocuments')
      userDatabase = new UserDatabase()
    })

    afterEach(() => {
      retrieveAllDocumentsSpy.mockReset()
      retrieveAllDocumentsSpy.mockRestore()
    })

    describe('when initPromise is a rejected promise', () => {
      beforeEach(() => {
        userDatabase.initPromise = Promise.reject(new Error('Bang!'))
      })

      it('does not call the retrieveAllDocuments function', () => {
        expect.assertions(1)
        return userDatabase.getAllUsers()
          .catch(() => {
            expect(retrieveAllDocumentsSpy).toHaveBeenCalledTimes(0)
          })
      })

      it('returns a rejected promise', () => {
        expect.assertions(1)
        return userDatabase.getAllUsers()
          .catch(error => {
            expect(error.message).toEqual('Bang!')
          })
      })
    })

    describe('when initPromise is a resolved promise', () => {
      const mockReturnValue = [
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          id: '1234',
          _id: '1234'
        }, {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@example.com',
          id: '5678',
          _id: '5678'
        }
      ]

      beforeEach(() => {
        userDatabase.initPromise = Promise.resolve()
      })

      it('calls the retrieveAllDocuments function', () => {
        retrieveAllDocumentsSpy.mockReturnValue(Promise.resolve(mockReturnValue))
        return userDatabase.getAllUsers()
          .then(() => {
            expect(retrieveAllDocumentsSpy).toHaveBeenCalledTimes(1)
          })
      })

      describe('when retrieveAllDocuments resolves', () => {
        it('returns the array of documents in the body of the resolved promise', () => {
          retrieveAllDocumentsSpy.mockReturnValue(Promise.resolve(mockReturnValue))

          return userDatabase.getAllUsers()
            .then(documents => {
              expect(documents).toEqual(mockReturnValue)
            })
        })
      })

      describe('when retrieveAllDocuments rejects', () => {
        it('returns the error in the body of the rejected promise', () => {
          retrieveAllDocumentsSpy.mockReturnValue(Promise.reject(new Error('Bang in the getUser method')))
          expect.assertions(1)
          return userDatabase.getAllUsers()
            .catch(error => {
              expect(error.message).toEqual('Bang in the getUser method')
            })
        })
      })
    })
  })

  describe('userDatabase getUserByEmail method', () => {
    let findDocumentSpy

    beforeEach(() => {
      findDocumentSpy = jest.spyOn(cloudantRequestHelper, 'findDocument')
      userDatabase = new UserDatabase()
    })

    afterEach(() => {
      findDocumentSpy.mockReset()
      findDocumentSpy.mockRestore()
    })

    describe('when initPromise is a rejected promise', () => {
      beforeEach(() => {
        userDatabase.initPromise = Promise.reject(new Error('Bang!'))
      })

      it('does not call the findDocument function', () => {
        expect.assertions(1)
        return userDatabase.getUserByEmail('john.doe@example.com')
          .catch(() => {
            expect(findDocumentSpy).toHaveBeenCalledTimes(0)
          })
      })

      it('returns a rejected promise', () => {
        expect.assertions(1)
        return userDatabase.getUserByEmail('john.doe@example.com')
          .catch(error => {
            expect(error.message).toEqual('Bang!')
          })
      })
    })

    describe('when initPromise is a resolved promise', () => {
      let email = 'john.doe@example.com'

      const mockReturnValue = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        id: '1234-abcd-5678-efgh',
        _id: '1234-abcd-5678-efgh'
      }

      beforeEach(() => {
        userDatabase.initPromise = Promise.resolve()
      })

      it('calls the findDocument function', () => {
        findDocumentSpy.mockReturnValue(Promise.resolve(mockReturnValue))
        return userDatabase.getUserByEmail(email)
          .then(() => {
            expect(findDocumentSpy).toHaveBeenCalledTimes(1)
          })
      })

      describe('when findDocument resolves', () => {
        it('returns the document in the body of the resolved promise', () => {
          findDocumentSpy.mockReturnValue(Promise.resolve(mockReturnValue))

          return userDatabase.getUserByEmail(email)
            .then(document => {
              expect(document).toEqual(mockReturnValue)
            })
        })
      })

      describe('when findDocument rejects', () => {
        it('returns the error in the body of the rejected promise', () => {
          findDocumentSpy.mockReturnValue(Promise.reject(new Error('Bang in the getUser method')))
          expect.assertions(1)
          return userDatabase.getUserByEmail(email)
            .catch(error => {
              expect(error.message).toEqual('Bang in the getUser method')
            })
        })
      })
    })
  })

  describe('userDatabase getUserById method', () => {
    let retrieveDocumentSpy

    beforeEach(() => {
      retrieveDocumentSpy = jest.spyOn(cloudantRequestHelper, 'retrieveDocument')
      userDatabase = new UserDatabase()
    })

    afterEach(() => {
      retrieveDocumentSpy.mockReset()
      retrieveDocumentSpy.mockRestore()
    })

    describe('when initPromise is a rejected promise', () => {
      beforeEach(() => {
        userDatabase.initPromise = Promise.reject(new Error('Bang!'))
      })

      it('does not call the retrieveDocument function', () => {
        expect.assertions(1)
        return userDatabase.getUserById('1234')
          .catch(() => {
            expect(retrieveDocumentSpy).toHaveBeenCalledTimes(0)
          })
      })

      it('returns a rejected promise', () => {
        expect.assertions(1)
        return userDatabase.getUserById('1234')
          .catch(error => {
            expect(error.message).toEqual('Bang!')
          })
      })
    })

    describe('when initPromise is a resolved promise', () => {
      let id = '1234-abcd-5678-efgh'

      const mockReturnValue = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        id: id,
        _id: id
      }

      beforeEach(() => {
        userDatabase.initPromise = Promise.resolve()
      })

      it('calls the retrieveDocument function', () => {
        retrieveDocumentSpy.mockReturnValue(Promise.resolve(mockReturnValue))
        return userDatabase.getUserById(id)
          .then(() => {
            expect(retrieveDocumentSpy).toHaveBeenCalledTimes(1)
          })
      })

      describe('when retrieveDocument resolves', () => {
        it('returns the document in the body of the resolved promise', () => {
          retrieveDocumentSpy.mockReturnValue(Promise.resolve(mockReturnValue))

          return userDatabase.getUserById(id)
            .then(document => {
              expect(document).toEqual(mockReturnValue)
            })
        })
      })

      describe('when retrieveDocument rejects', () => {
        it('returns the error in the body of the rejected promise', () => {
          retrieveDocumentSpy.mockReturnValue(Promise.reject(new Error('Bang in the getUser method')))
          expect.assertions(1)
          return userDatabase.getUserById(id)
            .catch(error => {
              expect(error.message).toEqual('Bang in the getUser method')
            })
        })
      })
    })
  })

  describe('userDatabase updateUser method', () => {
    let updateDocumentSpy

    let newUserDocument = {
      email: 'james.doe@example.com',
      tel: '0123456789'
    }

    beforeEach(() => {
      updateDocumentSpy = jest.spyOn(cloudantRequestHelper, 'updateDocument')
      userDatabase = new UserDatabase()
    })

    afterEach(() => {
      updateDocumentSpy.mockReset()
      updateDocumentSpy.mockRestore()
    })

    describe('when initPromise is a rejected promise', () => {
      beforeEach(() => {
        userDatabase.initPromise = Promise.reject(new Error('Bang!'))
      })

      it('does not call the updateDocument method', () => {
        expect.assertions(1)
        return userDatabase.updateUser(newUserDocument)
          .catch(() => {
            expect(updateDocumentSpy).toHaveBeenCalledTimes(0)
          })
      })

      it('returns a rejected promise', () => {
        expect.assertions(1)
        return userDatabase.updateUser(newUserDocument)
          .catch(error => {
            expect(error.message).toEqual('Bang!')
          })
      })
    })

    describe('when initPromise is a resolved promise', () => {
      beforeEach(() => {
        userDatabase.initPromise = Promise.resolve()
      })

      it('calls the updateDocument function', () => {
        updateDocumentSpy.mockReturnValue(Promise.resolve())
        return userDatabase.updateUser(newUserDocument)
          .then(() => {
            expect(updateDocumentSpy).toHaveBeenCalledTimes(1)
          })
      })

      describe('when updateDocument resolves', () => {
        it('returns a resolved promise', () => {
          updateDocumentSpy.mockReturnValue(Promise.resolve())
          return userDatabase.updateUser(newUserDocument)
        })
      })

      describe('when updateDocument rejects', () => {
        it('returns the error in the body of the rejected promise', () => {
          updateDocumentSpy.mockReturnValue(Promise.reject(new Error('Bang in the updateUser method')))
          expect.assertions(1)
          return userDatabase.updateUser(newUserDocument)
            .catch(error => {
              expect(error.message).toEqual('Bang in the updateUser method')
            })
        })
      })
    })
  })

  describe('userDatabase deleteUser method', () => {
    let deleteDocumentSpy
    let id = '1234-abcd-5678-efgh'

    beforeEach(() => {
      deleteDocumentSpy = jest.spyOn(cloudantRequestHelper, 'deleteDocument')
      userDatabase = new UserDatabase()
    })

    afterEach(() => {
      deleteDocumentSpy.mockReset()
      deleteDocumentSpy.mockRestore()
    })

    describe('when initPromise is a rejected promise', () => {
      beforeEach(() => {
        userDatabase.initPromise = Promise.reject(new Error('Bang!'))
      })

      it('does not call the deleteDocument function', () => {
        expect.assertions(1)
        return userDatabase.deleteUser(id)
          .catch(() => {
            expect(deleteDocumentSpy).toHaveBeenCalledTimes(0)
          })
      })

      it('returns a rejected promise', () => {
        expect.assertions(1)
        return userDatabase.deleteUser(id)
          .catch(error => {
            expect(error.message).toEqual('Bang!')
          })
      })
    })

    describe('when initPromise is a resolved promise', () => {
      beforeEach(() => {
        userDatabase.initPromise = Promise.resolve()
      })

      it('calls the deleteDocument function', () => {
        deleteDocumentSpy.mockReturnValue(Promise.resolve())
        return userDatabase.deleteUser(id)
          .then(() => {
            expect(deleteDocumentSpy).toHaveBeenCalledTimes(1)
          })
      })

      describe('when deleteDocument resolves', () => {
        it('returns a resolved promise', () => {
          deleteDocumentSpy.mockReturnValue(Promise.resolve())

          return userDatabase.deleteUser(id)
        })
      })

      describe('when deleteDocument rejects', () => {
        it('returns the error in the body of the rejected promise', () => {
          deleteDocumentSpy.mockReturnValue(Promise.reject(new Error('Bang in the deleteUser method')))
          expect.assertions(1)
          return userDatabase.deleteUser(id)
            .catch(error => {
              expect(error.message).toEqual('Bang in the deleteUser method')
            })
        })
      })
    })
  })
})

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

    beforeEach(() => {
      createDatabaseSpy = jest.spyOn(cloudantRequestHelper, 'createDatabase').mockReturnValue(Promise.resolve({ok: true}))
      useDatabaseSpy = jest.spyOn(cloudantRequestHelper, 'useDatabase').mockReturnValue(Promise.resolve(42))
      userDatabase = new UserDatabase()
    })

    afterEach(() => {
      createDatabaseSpy.mockReset()
      useDatabaseSpy.mockReset()
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
})

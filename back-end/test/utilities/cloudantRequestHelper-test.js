'use strict'

const cloudantRequestHelper = require('../../lib/utilities/cloudantRequestHelper.js')

describe('cloudantRequestHelper.js', () => {
  beforeEach(() => {
    // Reset the env variables
    process.env = {}
  })

  describe('createCloudantConnection', () => {
    describe('when the retryTimeout argument is not provided', () => {
      it('sets the retryTimeout to its default', () => {
        process.env = {
          CDB_USER: 'admin',
          CDB_PASS: 'pass'
        }

        const expectedOptions = {
          account: process.env.CDB_USER,
          password: process.env.CDB_PASS,
          plugin: 'retry',
          retryAttempts: 3,
          retryTimeout: 1000
        }

        const cloudant = cloudantRequestHelper.createCloudantConnection()
        expect(cloudant.fakeCloudantObject.retryTimeout).toEqual(expectedOptions.retryTimeout)
      })
    })

    describe('when the retryTimeout argument is provided', () => {
      it('sets retryTimeout to what is provided', () => {
        process.env = {
          CDB_USER: 'admin',
          CDB_PASS: 'pass'
        }

        const expectedOptions = {
          account: process.env.CDB_USER,
          password: process.env.CDB_PASS,
          plugin: 'retry',
          retryAttempts: 3,
          retryTimeout: 3000
        }

        const cloudant = cloudantRequestHelper.createCloudantConnection(3000)
        expect(cloudant.fakeCloudantObject.retryTimeout).toEqual(expectedOptions.retryTimeout)
      })
    })

    describe('when the retryAttempts argument is not provided', () => {
      it('sets retryAttempts to default', () => {
        process.env = {
          CDB_USER: 'admin',
          CDB_PASS: 'pass'
        }

        const expectedOptions = {
          account: process.env.CDB_USER,
          password: process.env.CDB_PASS,
          plugin: 'retry',
          retryAttempts: 3,
          retryTimeout: 3000
        }

        const cloudant = cloudantRequestHelper.createCloudantConnection(3000)
        expect(cloudant.fakeCloudantObject.retryAttempts).toEqual(expectedOptions.retryAttempts)
      })
    })

    describe('when the retryAttempts argument is provided', () => {
      it('sets retryAttempts to what is provided', () => {
        process.env = {
          CDB_USER: 'admin',
          CDB_PASS: 'pass'
        }

        const expectedOptions = {
          account: process.env.CDB_USER,
          password: process.env.CDB_PASS,
          plugin: 'retry',
          retryAttempts: 10,
          retryTimeout: 3000
        }

        const cloudant = cloudantRequestHelper.createCloudantConnection(3000, 10)
        expect(cloudant.fakeCloudantObject.retryAttempts).toEqual(expectedOptions.retryAttempts)
      })
    })

    describe('when CDB_USER is not provided', () => {
      it('throws an error', () => {
        expect(() => {
          cloudantRequestHelper.createCloudantConnection()
        }).toThrow('Cloudant DB user (CDB_USER) not set in the Environment variables!')
      })
    })

    describe('when CDB_USER is not provided', () => {
      it('throws an error', () => {
        process.env.CDB_USER = 'admin'
        expect(() => {
          cloudantRequestHelper.createCloudantConnection()
        }).toThrow('Cloudant DB password (CDB_PASS) not set in the Environment variables!')
      })
    })

    describe('when both CDB_USER and CDB_PASS are provided', () => {
      it('returns an instance of Cloudant', () => {

      })
    })
  })
})

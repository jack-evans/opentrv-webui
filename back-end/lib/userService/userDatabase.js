'use strict'

const bunyan = require('bunyan')
const cloudantRequestHelper = require('../utilities/cloudantRequestHelper')
const Promise = require('bluebird')

const DATABASE_NAME = 'user'
const logger = bunyan.createLogger({name: 'user-service-db', serializers: bunyan.stdSerializers})

/**
 * User Database Constructor
 * creates an instance of the user database
 * @constructor
 */
function UserDatabase () {
  this.cloudantInstance = cloudantRequestHelper.createCloudantConnection()
  this.database = undefined
  this.initPromise = undefined
}

UserDatabase.prototype.initialise = function () {
  let self = this

  return cloudantRequestHelper.createDatabase(self.cloudantInstance, DATABASE_NAME)
    .then(function () {
      self.database = cloudantRequestHelper.useDatabase(self.cloudantInstance, DATABASE_NAME)
      self.initPromise = Promise.resolve()
      return Promise.resolve()
    })
    .catch(function (error) {
      logger.error(`Encountered error when attempting to initialise the '${DATABASE_NAME}' database, reason: `, error)
      self.initPromise = Promise.reject(error)
      return Promise.reject(error)
    })
}

UserDatabase.prototype.createUser = function (userDocument) {

}

module.exports = UserDatabase

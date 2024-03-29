'use strict'

const bunyan = require('bunyan')
const cloudantRequestHelper = require('../utilities/cloudantRequestHelper')
const Promise = require('bluebird')
const uuidv4 = require('uuid/v4')

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

/**
 * Initialise method
 *
 * Creates a database in the Cloudant instance for users
 * @returns {Promise} on the action of initialising the user database
 */
UserDatabase.prototype.initialise = function () {
  let self = this

  return cloudantRequestHelper.createDatabase(self.cloudantInstance, DATABASE_NAME)
    .then(function () {
      self.database = cloudantRequestHelper.useDatabase(self.cloudantInstance, DATABASE_NAME)
      self.initPromise = Promise.resolve()

      let dDoc = { name: 'email', type: 'json', index: { fields: [ 'email' ] } }
      return cloudantRequestHelper.createIndex(self.database, DATABASE_NAME, dDoc)
    })
    .catch(function (error) {
      logger.error(`Encountered error when attempting to initialise the '${DATABASE_NAME}' database, reason: `, error)
      self.initPromise = Promise.reject(error)
      return Promise.reject(error)
    })
}

/**
 * createUser method
 *
 * Creates a user in the user database
 * @param {Object} userDocument - the document for the user
 * @returns {Promise} on the action of inserting a document into the user database
 */
UserDatabase.prototype.createUser = function (userDocument) {
  let self = this

  return self.initPromise
    .then(function () {
      let id = uuidv4()

      userDocument.id = id
      userDocument._id = id

      return cloudantRequestHelper.createDocument(self.database, DATABASE_NAME, userDocument)
    })
    .catch(function (error) {
      logger.error(`Encountered error when creating document in the '${DATABASE_NAME}' database, reason: `, error)
      return Promise.reject(error)
    })
}

/**
 * getAllUsers method
 *
 * Retrieves all users from the user database
 * @returns {Promise} on the action of retrieving all users from the user database
 */
UserDatabase.prototype.getAllUsers = function () {
  let self = this

  return self.initPromise
    .then(function () {
      return cloudantRequestHelper.retrieveAllDocuments(self.database, DATABASE_NAME)
    })
    .catch(function (error) {
      logger.error(`Encountered error when retrieving document in the '${DATABASE_NAME}' database, reason: `, error)
      return Promise.reject(error)
    })
}

/**
 * getUserByEmail method
 *
 * Retrieve a user from the user database by an email
 * @param {String} userEmail - the user email
 * @returns {Promise} on the action of retrieving a user from the user database by their email
 */
UserDatabase.prototype.getUserByEmail = function (userEmail) {
  let self = this

  return self.initPromise
    .then(function () {
      return cloudantRequestHelper.findDocument(self.database, DATABASE_NAME, { selector: { email: userEmail } })
    })
    .catch(function (error) {
      logger.error(`Encountered error when finding document in the '${DATABASE_NAME}' database, reason: `, error)
      return Promise.reject(error)
    })
}

/**
 * getUserById method
 *
 * Retrieves a user document from the user database
 * @param {String} userId - the id of the user to retrieve
 * @return {Promise} on the action of retrieving a document from the user database
 */
UserDatabase.prototype.getUserById = function (userId) {
  let self = this

  return self.initPromise
    .then(function () {
      return cloudantRequestHelper.retrieveDocument(self.database, DATABASE_NAME, userId)
    })
    .catch(function (error) {
      logger.error(`Encountered error when retrieving document in the '${DATABASE_NAME}' database, reason: `, error)
      return Promise.reject(error)
    })
}

/**
 * updateUser method
 *
 * Update a user in the user database
 * @param {Object} userDocument - the new content for the user
 * @returns {Promise} on the action of updating a user in the user database
 */
UserDatabase.prototype.updateUser = function (userDocument) {
  let self = this

  return self.initPromise
    .then(function () {
      return cloudantRequestHelper.updateDocument(self.database, DATABASE_NAME, userDocument)
    })
    .catch(function (error) {
      logger.error(`Encountered error when updating a document in the '${DATABASE_NAME}' database, reason: `, error)
      return Promise.reject(error)
    })
}

/**
 * deleteUser method
 *
 * Delete user document in the user database
 * @param {String} userId - the id of the user document to delete
 * @returns {Promise} on the action of deleting a user in the user database
 */
UserDatabase.prototype.deleteUser = function (userId) {
  let self = this

  return self.initPromise
    .then(function () {
      return cloudantRequestHelper.deleteDocument(self.database, DATABASE_NAME, userId)
    })
    .catch(function (error) {
      logger.error(`Encountered error when deleting a document in the '${DATABASE_NAME}' database, reason: `, error)
      return Promise.reject(error)
    })
}

module.exports = UserDatabase

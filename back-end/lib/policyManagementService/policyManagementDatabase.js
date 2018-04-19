'use strict'

const bunyan = require('bunyan')
const cloudantRequestHelper = require('../utilities/cloudantRequestHelper')
const databaseName = 'policies'
const Promise = require('bluebird')
const uuidv4 = require('uuid/v4')

const logger = bunyan.createLogger({name: 'policy-management-service-db', serializers: bunyan.stdSerializers})

/**
 * PolicyManagement Database Constructor
 * creates an instance of the PolicyManagement Database
 * @constructor
 */
function PolicyManagementDatabase () {
  this.cloudantInstance = cloudantRequestHelper.createCloudantConnection()
  this.database = undefined
  this.initPromise = undefined
}

/**
 * Initialise method
 *
 * Creates a database in the Cloudant instance for the devices
 * @returns {Promise} on the action of initialising the device database
 */
PolicyManagementDatabase.prototype.initialise = function () {
  let self = this

  return cloudantRequestHelper.createDatabase(self.cloudantInstance, databaseName)
    .then(function () {
      self.database = cloudantRequestHelper.useDatabase(self.cloudantInstance, databaseName)
      self.initPromise = Promise.resolve()
      return Promise.resolve()
    })
    .catch(function (error) {
      logger.error(`Encountered error when attempting to initialise the '${databaseName}' database, reason: `, error)
      self.initPromise = Promise.reject(error)
      return Promise.reject(error)
    })
}

/**
 * createPolicy method
 *
 * Creates a policy in the policies database
 * @param {Object} deviceDocument - document for the device
 * @returns {Promise} on the action of inserting a document into the policies database
 */
PolicyManagementDatabase.prototype.createPolicy = function (deviceDocument) {
  let self = this

  return self.initPromise
    .then(function () {
      let id = uuidv4()

      deviceDocument.id = id
      deviceDocument._id = id

      return cloudantRequestHelper.createDocument(self.database, databaseName, deviceDocument)
    })
    .catch(function (error) {
      logger.error(`Encountered error when creating document in the '${databaseName}' database, reason: `, error)
      return Promise.reject(error)
    })
}

/**
 * getPolicy method
 *
 * Retrieves a policy document from the policies database
 * @param {String} policyId - the id of the policy document to be retrieved
 * @returns {Promise} on the action of retrieving a document from the policies database
 */
PolicyManagementDatabase.prototype.getPolicy = function (policyId) {
  let self = this

  return self.initPromise
    .then(function () {
      return cloudantRequestHelper.retrieveDocument(self.database, databaseName, policyId)
    })
    .catch(function (error) {
      logger.error(`Encountered error when retrieving document in the '${databaseName}' database, reason: `, error)
      return Promise.reject(error)
    })
}

/**
 * getAllPolicies method
 *
 * Retrieves all device documents stored in the policies database for the user id
 * @returns {Promise} on the action of retrieving the policies from the policies database
 */
PolicyManagementDatabase.prototype.getAllPolicies = function () {
  let self = this

  return self.initPromise
    .then(function () {
      return cloudantRequestHelper.retrieveAllDocuments(self.database, databaseName)
    })
    .catch(function (error) {
      logger.error(`Encountered error when retrieving documents in the '${databaseName}' database, reason: `, error)
      return Promise.reject(error)
    })
}

/**
 * updatePolicy method
 *
 * Update a policy in the policies database
 * @param {Object} policyDoc - the new content for the policy
 * @returns {Promise} on the action of updating a policy in the policies database
 */
PolicyManagementDatabase.prototype.updatePolicy = function (policyDoc) {
  let self = this

  return self.initPromise
    .then(function () {
      return cloudantRequestHelper.updateDocument(self.database, databaseName, policyDoc)
    })
    .catch(function (error) {
      logger.error(`Encountered error when updating a document in the '${databaseName}' database, reason: `, error)
      return Promise.reject(error)
    })
}

/**
 * deletePolicy method
 *
 * Delete a policy document in the policies database
 * @param {String} policyId - the id of the document to delete
 * @returns {Promise} on the action of deleting a policy in the policies database
 */
PolicyManagementDatabase.prototype.deletePolicy = function (policyId) {
  let self = this

  return self.initPromise
    .then(function () {
      return cloudantRequestHelper.deleteDocument(self.database, databaseName, policyId)
    })
    .catch(function (error) {
      logger.error(`Encountered error when deleting a document in the '${databaseName}' database, reason: `, error)
      return Promise.reject(error)
    })
}

module.exports = PolicyManagementDatabase

'use strict'

const bunyan = require('bunyan')
const cloudantRequestHelper = require('../utilities/cloudantRequestHelper')
const databaseName = 'devices'
const Promise = require('bluebird')
const uuidv4 = require('uuid/v4')

const logger = bunyan.createLogger({name: 'device-discovery-service-db', serializers: bunyan.stdSerializers})

/**
 * Device Database Constructor
 * creates an instance of the device Database
 * @constructor
 */
function DeviceDatabase () {
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
DeviceDatabase.prototype.initialise = function () {
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
 * createDevice method
 *
 * Creates a device in the device database
 * @param {Object} deviceDocument - document for the device
 * @returns {Promise} on the action of inserting a document into the device database
 */
DeviceDatabase.prototype.createDevice = function (deviceDocument) {
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
 * getDeviceInformation method
 *
 * Retrieves a device document from the device database
 * @param deviceDocumentId
 * @returns {Promise} on the action of retrieving a document from the device database
 */
DeviceDatabase.prototype.getDeviceInformation = function (deviceDocumentId) {
  let self = this

  return self.initPromise
    .then(function () {
      return cloudantRequestHelper.retrieveDocument(self.database, databaseName, deviceDocumentId)
    })
    .catch(function (error) {
      logger.error(`Encountered error when retrieving document in the '${databaseName}' database, reason: `, error)
      return Promise.reject(error)
    })
}

/**
 * getAllDevices method
 *
 * Retrieves all device documents stored in the device database
 * @returns {Promise} on the action of retrieving a document from the device database
 */
DeviceDatabase.prototype.getAllDevices = function () {
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

/*
DeviceDatabase.prototype.updateDevice = function (deviceDocument) {
  let self = this

  self.initPromise
    .then(function () {
      return cloudantRequestHelper.updateDocument(self.database, databaseName, deviceDocument)
    })
}
*/

DeviceDatabase.prototype.deleteDevice = function (deviceDocumentId) {
  let self = this

  return self.initPromise
    .then(function () {
      return cloudantRequestHelper.deleteDocument(self.database, databaseName, deviceDocumentId)
    })
    .catch(function (error) {
      logger.error(`Encountered error when deleting a document in the '${databaseName}' database, reason: `, error)
      return Promise.reject(error)
    })
}

module.exports = DeviceDatabase

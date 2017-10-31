'use strict'

const bunyan = require('bunyan')
const Cloudant = require('cloudant')
const Promise = require('bluebird')

const logger = bunyan.createLogger({name: 'opentrv-webui', serializers: bunyan.stdSerializers})

/**
 * createCloudantConnection function
 *
 * Authenticates with IBM Cloudant and returns a IBM Cloudant instance
 * @param {Number} retryTimeout - time to wait between requests
 * @param {Number} retryAttempts - number of attempts to be made
 * @returns {Cloudant} authenticated IBM Cloudant instance
 */
module.exports.createCloudantConnection = (retryTimeout = 1000, retryAttempts = 3) => {
  let username
  let password

  if (!process.env.CDB_USER) {
    throw new Error('Cloudant DB user (CDB_USER) not set in the Environment variables!')
  } else {
    username = process.env.CDB_USER
  }

  if (!process.env.CDB_PASS) {
    throw new Error('Cloudant DB password (CDB_PASS) not set in the Environment variables!')
  } else {
    password = process.env.CDB_PASS
  }

  return Cloudant({
    account: username,
    password: password,
    plugin: 'retry',
    retryAttempts: retryAttempts,
    retryTimeout: retryTimeout
  })
}

/**
 * createDatabase function
 *
 * Creates a database on the cloudant instance
 * @param {Cloudant} cloudantInstance - the cloudant instance to use
 * @param {String} databaseName - name of the database to create
 * @param {Object} databaseReference - reference to the database object
 * @returns {*} Promise on the action of creating a database
 */
module.exports.createDatabase = (cloudantInstance, databaseName, databaseReference) => {
  return new Promise((resolve, reject) => {
    cloudantInstance.db.create(databaseName, (err) => {
      if (err) {
        logger.info(`Unable to create database ${databaseName}. Error received from cloudant: `, err)
        reject(err)
      } else {
        logger.info(`successfully created database called ${databaseName} in the cloudant instance`)
        databaseReference = cloudantInstance.db.use(databaseName)
        resolve()
      }
    })
  })
}

/**
 * createDocument function
 *
 * Inserts a document into the database specified
 * @param {Object} database - the cloudant database to insert the document into
 * @param {Object} document - the document to be inserted
 * @returns {*} Promise on the action of creating a document in a database
 */
module.exports.createDocument = (database, document) => {
  return new Promise((resolve, reject) => {
    database.insert(document, (err, body) => {
      if (err) {
        logger.info(`Unable to create document in the ${database} database. Error received from cloudant: `, err)
        reject(err)
      } else {
        resolve(body)
      }
    })
  })
}

/**
 * retrieveDocument function
 *
 * Retrive a document by the id of the document
 * @param {Object} database - the cloudant database to retrieve the document from
 * @param {String} documentId - ID of the document to be retrieved
 * @returns {*} Promise on the action of retrieving a document from a database
 */
module.exports.retrieveDocument = (database, documentId) => {
  return new Promise((resolve, reject) => {
    database.get(documentId, (err, body) => {
      if (err) {
        logger.info(`Unable to retrieve document from the ${database} database. Error received from cloudant: `, err)
        reject(err)
      } else {
        resolve(body)
      }
    })
  })
}

/**
 * retrieveAllDocuments function
 *
 * Retrieve all the documents from a given database
 * @param {Object} database - the cloudant database to retrieve all the documents from
 * @returns {*} Promise on the action of retrieving all documents from a database
 */
module.exports.retrieveAllDocuments = (database) => {
  return new Promise((resolve, reject) => {
    database.list((err, body) => {
      if (err) {
        console.log(`Unable to retrieve documents from the ${database} database. Error received from cloudant: `, err)
        reject(err)
      } else {
        resolve(body)
      }
    })
  })
}

/**
 * updateDocument function
 *
 * Update a given document in a database
 * @param {Object} database - the cloudant database that has a document to be updated
 * @param {Object} newDocument - the document to update it with
 * @returns {*} Promise on the action of updating a document in a database
 */
module.exports.updateDocument = (database, newDocument) => {
  return new Promise((resolve, reject) => {
    database.insert(newDocument, (err, body) => {
      if (err) {
        console.log(`Unable to update document in the ${database} database. Error received from cloudant: `, err)
        reject(err)
      } else {
        resolve(body)
      }
    })
  })
}

/**
 * deleteDocument funtion
 *
 * Delete a given document in a database
 * @param {Object} database - the cloudant database with the document to be deleted
 * @param {String} documentId - the ID of the document to be deleted
 * @returns {*} - Promise on the deletion of the document from a database
 */
module.exports.deleteDocument = (database, documentId) => {
  return new Promise((resolve, reject) => {
    database.destroy(documentId, (err, body) => {
      if (err) {
        console.log(`Unable to delete document in the ${database} database. Error received from cloudant: `, err)
        reject(err)
      } else {
        resolve(body)
      }
    })
  })
}

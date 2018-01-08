'use strict'

const bunyan = require('bunyan')
const Cloudant = require('cloudant')
const Promise = require('bluebird')

const logger = bunyan.createLogger({name: 'utilities-cloudantRequestHelper', serializers: bunyan.stdSerializers})

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
 * @returns {*} Promise on the action of creating a database
 */
module.exports.createDatabase = (cloudantInstance, databaseName) => {
  return new Promise((resolve, reject) => {
    cloudantInstance.db.create(databaseName, (err, body) => {
      if (err) {
        // When the database already exists
        if (err.statusCode === 412) {
          logger.info(`Database '${databaseName}' already exists`)
          resolve({ok: true})
        } else {
          logger.info(`Unable to create database '${databaseName}'. Error received from cloudant: `, err)
          reject(err)
        }
      } else {
        logger.info(`successfully created database called ${databaseName} in the cloudant instance`)
        resolve(body)
      }
    })
  })
}

/**
 * useDatabase function
 *
 * Returns the database to be used from the cloudant instance
 * @param {Cloudant} cloudantInstance - the cloudant instance to use
 * @param {String} databaseName - name of the database to be used
 * @returns {*} - the database
 */
module.exports.useDatabase = (cloudantInstance, databaseName) => {
  return cloudantInstance.db.use(databaseName)
}

/**
 * createIndex function
 *
 * Creates a design document that can be used to filter through a database
 * @param database - the cloudant database to insert the document into
 * @param databaseName - the name of the database being interacted with
 * @param ddoc - design document
 * @returns {*} Promise on the action of creating a design document
 */
module.exports.createIndex = (database, databaseName, ddoc) => {
  return new Promise((resolve, reject) => {
    database.index(ddoc, (err, body) => {
      if (err) {
        logger.info(`Unable to create design document in the '${databaseName}' database. Error received from cloudant: `, err)
        reject(err)
      } else {
        resolve(body)
      }
    })
  })
}

/**
 * createDocument function
 *
 * Inserts a document into the database specified
 * @param {Object} database - the cloudant database to insert the document into
 * @param {String} databaseName - the name of the database being interacted with
 * @param {Object} document - the document to be inserted
 * @returns {*} Promise on the action of creating a document in a database
 */
module.exports.createDocument = (database, databaseName, document) => {
  return new Promise((resolve, reject) => {
    document._id = document.id
    database.insert(document, (err, body) => {
      if (err) {
        logger.info(`Unable to create document in the '${databaseName}' database. Error received from cloudant: `, err)
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
 * Retrieve a document by the id of the document
 * @param {Object} database - the cloudant database to retrieve the document from
 * @param {Object} databaseName - the name of the database being interacted with
 * @param {String} documentId - ID of the document to be retrieved
 * @returns {*} Promise on the action of retrieving a document from a database
 */
module.exports.retrieveDocument = (database, databaseName, documentId) => {
  return new Promise((resolve, reject) => {
    database.get(documentId, (err, body) => {
      if (err) {
        logger.info(`Unable to retrieve document from the '${databaseName}' database. Error received from cloudant: `, err)
        reject(err)
      } else {
        delete body._id
        delete body._rev
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
 * @param {Object} databaseName - the name of the database being interacted with
 * @returns {*} Promise on the action of retrieving all documents from a database
 */
module.exports.retrieveAllDocuments = (database, databaseName) => {
  return new Promise((resolve, reject) => {
    database.list({include_docs: true}, (err, body) => {
      if (err) {
        logger.info(`Unable to retrieve documents from the '${databaseName}' database. Error received from cloudant: `, err)
        reject(err)
      } else {
        resolve(body.rows)
      }
    })
  })
}

/**
 * updateDocument function
 *
 * Update a given document in a database
 * @param {Object} database - the cloudant database that has a document to be updated
 * @param {Object} databaseName - the name of the database being interacted with
 * @param {Object} newDocument - the document to update it with
 * @returns {*} Promise on the action of updating a document in a database
 */
module.exports.updateDocument = (database, databaseName, newDocument) => {
  return new Promise((resolve, reject) => {
    database.get(newDocument.id, (err, body) => {
      if (err) {
        reject(err)
      }
      newDocument._rev = body._rev
      newDocument._id = body._id
      database.insert(newDocument, (err, body) => {
        if (err) {
          logger.info(`Unable to update document in the '${databaseName}' database. Error received from cloudant: `, err)
          reject(err)
        } else {
          resolve(body)
        }
      })
    })
  })
}

/**
 * deleteDocument function
 *
 * Delete a given document in a database
 * @param {Object} database - the cloudant database with the document to be deleted
 * @param {Object} databaseName - the name of the database being interacted with
 * @param {String} documentId - the ID of the document to be deleted
 * @returns {*} - Promise on the deletion of the document from a database
 */
module.exports.deleteDocument = (database, databaseName, documentId) => {
  return new Promise((resolve, reject) => {
    database.get(documentId, (err, body) => {
      if (err) {
        reject(err)
      }

      database.destroy(documentId, body._rev, (err, body) => {
        if (err) {
          logger.info(`Unable to delete document in the '${databaseName}' database. Error received from cloudant: `, err)
          reject(err)
        } else {
          resolve(body)
        }
      })
    })
  })
}

'use strict'

const Cloudant = require('cloudant')

/**
 * createCloudantConnection function
 *
 * Authenticates with IBM Cloudant and returns a IBM Cloudant instance
 * @returns {Cloudant} authenticated IBM Cloudant instance
 */
module.exports.createCloudantConnection = () => {
  let username
  let password

  if (!process.env.CDB_USER) {
    throw new Error('Cloudant DB user (CDB_USER) not defined!')
  } else {
    username = process.env.CDB_USER
  }

  if (!process.env.CDB_PASS) {
    throw new Error('Cloudant DB password (CDB_PASS) not defined!')
  } else {
    password = process.env.CDB_PASS
  }

  return Cloudant({account: username, password: password, plugin: 'promises'})
}

/**
 * createDatabase function
 *
 * Creates a database on the cloudant instance
 * @param {*} cloudantInstance - the cloudant instance to use
 * @param {String} databaseName - name of the database to create
 */
module.exports.createDatabase = (cloudantInstance, databaseName) => {
  return cloudantInstance.db.create(databaseName)
}

/**
 * createDocument function
 *
 * Inserts a document into the database specified
 * @param {Object} database - the cloudant database to insert the document into
 * @param {Object} document - the document to be inserted
 */
module.exports.createDocument = (database, document) => {
  return database.insert(document)
}

/**
 * retrieveDocument function
 *
 * Retrive a document by the id of the document
 * @param {Object} database - the cloudant database to retrieve the document from
 * @param {String} documentId - ID of the document to be retrieved
 */
module.exports.retrieveDocument = (database, documentId) => {
  return database.get(documentId)
}

/**
 * retrieveAllDocuments function
 *
 * Retrieve all the documents from a given database
 * @param {Object} database - the cloudant database to retrieve all the documents from
 */
module.exports.retrieveAllDocuments = (database) => {
  return database.list()
}

/**
 * updateDocument function
 *
 * Update a given document in a database
 * @param {Object} database - the cloudant database that has a document to be updated
 * @param {Object} newDocument - the document to update it with
 */
module.exports.updateDocument = (database, newDocument) => {
  return database.insert(newDocument)
}

/**
 * deleteDocument funtion
 *
 * Delete a given document in a database
 * @param {Object} database - the cloudant database with the document to be deleted
 * @param {String} documentId - the ID of the document to be deleted
 * @returns {*} - Promise on the deletion of the document
 */
module.exports.deleteDocument = (database, documentId) => {
  return database.destroy(documentId)
}

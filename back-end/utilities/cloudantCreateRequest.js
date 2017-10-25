'use strict'

const Cloudant = require('cloudant')

/**
 * createCloudantConnection function
 *
 * Authenticates with IBM Cloudant and returns a IBM Cloudant instance
 * @returns {*} authenticated IBM Cloudant instance
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

  return cloudantInstance.
}

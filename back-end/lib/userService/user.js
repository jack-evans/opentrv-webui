
const bunyan = require('bunyan')

const logger = bunyan.createLogger({name: 'user-service', serializers: bunyan.stdSerializers})


const logFunctionEntry = (functionName, isInternalFunction, options) => {
  let logMessage = 'Entered into the ' + functionName
  if (isInternalFunction) {
    logMessage += ' internal '
  }
  logMessage += 'function'
  logger.info(logMessage, options)
}
/**
 * POST /user
 *
 * @param {Object} req - the HTTP request object
 * @param {Object} res - the HTTP response object
 */
const createUserRequestHandler = (req, res) => {
  logFunctionEntry('createUserRequestHandler', false, undefined)
}

/**
 * _createUser internal function
 *
 * @param {Object} userDB - the user database
 * @param {Object} user - the user object to insert into the user database
 * @private
 */
const _createUser = (userDB, user) => {
  logFunctionEntry('_createUser', true, user)
}

/**
 * GET /user/{id}
 *
 * @param {Object} req - the HTTP request object
 * @param {Object} res - the HTTP response object
 */
const getUserRequestHandler = (req, res) => {
  logFunctionEntry('getUserRequestHandler', false, undefined)
}

/**
 * _getUser internal function
 *
 * @param {Object} userDB - the user database
 * @param {String} userId - the id of the user to retrieve from the user database
 * @private
 */
const _getUser = (userDB, userId) => {
  logFunctionEntry('_getUser', true, {userId: userId})
}

/**
 * PUT /user/{id}
 *
 * @param {Object} req - the HTTP request object
 * @param {Object} res - the HTTP response object
 */
const updateUserRequestHandler = (req, res) => {
  logFunctionEntry('updateUserRequestHandler', false, undefined)
}

/**
 * _updateUser internal function
 *
 * @param {Object} userDB - the user database
 * @param {Object} user - the new user information to update the current one with
 * @private
 */
const _updateUser = (userDB, user) => {
  logFunctionEntry('_updateUser', true, user)
}

/**
 * DELETE /user/{id}
 *
 * @param {Object} req - the HTTP request object
 * @param {Object} res - the HTTP response object
 */
const deleteUserRequestHandler = (req, res) => {
  logFunctionEntry('deleteUserRequestHandler', false, undefined)
}

/**
 * _deleteUser internal function
 *
 * @param {Object} userDB - the user database
 * @param {String} userId - the id of the user to be deleted from the user database
 * @private
 */
const _deleteUser = (userDB, userId) => {
  logFunctionEntry('_deleteUser', true, {userId: userId})
}

module.exports = {
  createUserRequestHandler: createUserRequestHandler,
  getUserRequestHandler: getUserRequestHandler,
  updateUserRequestHandler: updateUserRequestHandler,
  deleteUserRequestHandler: deleteUserRequestHandler,
  internal: {
    _createUser: _createUser,
    _getUser: _getUser,
    _updateUser: _updateUser,
    _deleteUser: _deleteUser
  }
}

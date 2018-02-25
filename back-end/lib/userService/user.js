
const bunyan = require('bunyan')

const logger = bunyan.createLogger({name: 'user-service', serializers: bunyan.stdSerializers})

/**
 * POST /user
 *
 * @param {Object} req - the HTTP request object
 * @param {Object} res - the HTTP response object
 */
const createUserRequestHandler = (req, res) => {

}

/**
 * _createUser internal function
 *
 * @param {Object} userDB - the user database
 * @param {Object} user - the user object to insert into the user database
 * @private
 */
const _createUser = (userDB, user) => {

}

/**
 * GET /user/{id}
 *
 * @param {Object} req - the HTTP request object
 * @param {Object} res - the HTTP response object
 */
const getUserRequestHandler = (req, res) => {

}

/**
 * _getUser internal function
 *
 * @param {Object} userDB - the user database
 * @param {String} userId - the id of the user to retrieve from the user database
 * @private
 */
const _getUser = (userDB, userId) => {

}

/**
 * PUT /user/{id}
 *
 * @param {Object} req - the HTTP request object
 * @param {Object} res - the HTTP response object
 */
const updateUserRequestHandler = (req, res) => {

}

/**
 * _updateUser internal function
 *
 * @param {Object} userDB - the user database
 * @param {Object} user - the new user information to update the current one with
 * @private
 */
const _updateUser = (userDB, user) => {

}

/**
 * DELETE /user/{id}
 *
 * @param {Object} req - the HTTP request object
 * @param {Object} res - the HTTP response object
 */
const deleteUserRequestHandler = (req, res) => {

}

/**
 * _deleteUser internal function
 *
 * @param {Object} userDB - the user database
 * @param {String} userId - the id of the user to be deleted from the user database
 * @private
 */
const _deleteUser = (userDB, userId) => {

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

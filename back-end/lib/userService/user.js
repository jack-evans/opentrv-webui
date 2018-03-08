
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

  module.exports.internal._createUser(req.userDb, req.body)
    .then(() => {
      logger.info('Successfully registered a new user')
      res.status(201).end()
    })
    .catch(error => {
      switch (error.statusCode) {
        case 400: {
          logger.error('Encountered bad request in the createUserRequestHandler function', error)
          res.status(400).send(error)
          break
        }

        case 409: {
          logger.error('Encountered conflict in the createUserRequestHandler', error)
          res.status(409).send(error)
          break
        }

        case 500: {
          logger.error('Encountered internal server error in the createUserRequestHandler', error)
          res.status(500).send(error)
          break
        }
      }
    })
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

  module.exports.internal._getUser(req.userDb, req.params.id)
    .then((user) => {
      logger.info('Successfully registered a new user')
      res.status(200).send(user)
    })
    .catch(error => {
      switch (error.statusCode) {
        case 400: {
          logger.error('Encountered bad request in the getUserRequestHandler function', error)
          res.status(400).send(error)
          break
        }

        case 404: {
          logger.error('Encountered not found in the getUserRequestHandler', error)
          res.status(404).send(error)
          break
        }

        case 500: {
          logger.error('Encountered internal server error in the getUserRequestHandler', error)
          res.status(500).send(error)
          break
        }
      }
    })
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

  module.exports.internal._updateUser(req.userDb, req.body)
    .then((user) => {
      logger.info('Successfully updated user')
      res.status(200).send(user)
    })
    .catch(error => {
      switch (error.statusCode) {
        case 400: {
          logger.error('Encountered bad request in the updateUserRequestHandler function', error)
          res.status(400).send(error)
          break
        }

        case 404: {
          logger.error('Encountered not found in the updateUserRequestHandler', error)
          res.status(404).send(error)
          break
        }

        case 409: {
          logger.error('Encountered conflict in the updateUserRequestHandler', error)
          res.status(409).send(error)
          break
        }

        case 500: {
          logger.error('Encountered internal server error in the updateUserRequestHandler', error)
          res.status(500).send(error)
          break
        }
      }
    })
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

  module.exports.internal._deleteUser(req.userDb, req.params.id)
    .then((user) => {
      logger.info('Successfully deleted user')
      res.status(204).end()
    })
    .catch(error => {
      switch (error.statusCode) {
        case 400: {
          logger.error('Encountered bad request in the deleteUserRequestHandler function', error)
          res.status(400).send(error)
          break
        }

        case 404: {
          logger.error('Encountered not found in the deleteUserRequestHandler', error)
          res.status(404).send(error)
          break
        }

        case 409: {
          logger.error('Encountered conflict in the deleteUserRequestHandler', error)
          res.status(409).send(error)
          break
        }

        case 500: {
          logger.error('Encountered internal server error in the deleteUserRequestHandler', error)
          res.status(500).send(error)
          break
        }
      }
    })
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

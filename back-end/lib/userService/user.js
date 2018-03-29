
const bcrypt = require('bcrypt')
const bunyan = require('bunyan')
const jwt = require('jsonwebtoken')
const Promise = require('bluebird')

const logger = bunyan.createLogger({name: 'user-service', serializers: bunyan.stdSerializers})
const saltRounds = 10

/**
 * logFunctionEntry
 *
 * @param {String} functionName - name of the function
 * @param {Boolean} isInternalFunction - is it an internal function
 * @param {Object} options - properties to be logged
 */
const logFunctionEntry = (functionName, isInternalFunction, options) => {
  let logMessage = 'Entered into the ' + functionName
  if (isInternalFunction) {
    logMessage += ' internal'
  }
  logMessage += ' function'
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
      res.status(201).send({})
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

        default: {
          logger.error('Encountered unexpected error in the createUserRequestHandler', error)
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
  logFunctionEntry('_createUser', true, undefined)

  return bcrypt.hash(user.password, saltRounds)
    .then(hash => {
      const userDocument = {
        name: user.name,
        email: user.email,
        password: hash,
        address: user.address
      }
      return userDB.createUser(userDocument)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

/**
 * GET /user
 *
 * @param {Object} req - the HTTP request object
 * @param {Object} res - the HTTP response object
 */
const getUsersRequestHandler = (req, res) => {
  logFunctionEntry('getUsersRequestHandler', false, undefined)
  let promise

  if (req.query.email) {
    promise = module.exports.internal._getUserByEmail(req.userDb, req.query.email)
  } else {
    promise = module.exports.internal._getUsers(req.userDb)
  }

  promise
    .then(users => {
      res.status(200).send(users)
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
 * _getUsers internal function
 *
 * @param {Object} userDB - the user database
 * @private
 */
const _getUsers = (userDB) => {
  logFunctionEntry('_getUsers', true, undefined)
  return userDB.getAllUsers()
}

/**
 * _getUserByEmail internal function
 *
 * @param {Object} userDB - the user database
 * @param {String} userEmail - the email of the user to retrieve from the user database
 * @private
 */
const _getUserByEmail = (userDB, userEmail) => {
  logFunctionEntry('_getUserByEmail', true, undefined)
  return userDB.getUserByEmail(userEmail)
}

/**
 * GET /user/{id}
 *
 * @param {Object} req - the HTTP request object
 * @param {Object} res - the HTTP response object
 */
const getUserByIdRequestHandler = (req, res) => {
  logFunctionEntry('getUserByIdRequestHandler', false, undefined)

  module.exports.internal._getUserById(req.userDb, req.params.id)
    .then(user => {
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
 * _getUserById internal function
 *
 * @param {Object} userDB - the user database
 * @param {String} userId - the id of the user to retrieve from the user database
 * @private
 */
const _getUserById = (userDB, userId) => {
  logFunctionEntry('_getUserById', true, {userId: userId})

  let error = {}

  if (!userId) {
    error.statusCode = 400
    error.message = 'The id provided was undefined'
    error.name = 'bad request'
    return Promise.reject(error)
  }

  if (typeof userId !== 'string') {
    error.statusCode = 400
    error.message = 'The id provided was not in string format'
    error.name = 'bad request'
    return Promise.reject(error)
  }

  // check uuid in following format [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}
  let regex = new RegExp('[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')

  if (!regex.test(userId)) {
    error.statusCode = 400
    error.message = 'Id did not match the following regex: ' + regex
    error.name = 'bad request'
    return Promise.reject(error)
  }

  return userDB.getUserById(userId)
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
      res.status(204).send({})
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

  let error = {}

  if (!userId) {
    error.statusCode = 400
    error.message = 'The id provided was undefined'
    error.name = 'bad request'
    return Promise.reject(error)
  }

  if (typeof userId !== 'string') {
    error.statusCode = 400
    error.message = 'The id provided was not in string format'
    error.name = 'bad request'
    return Promise.reject(error)
  }

  // check uuid in following format [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}
  let regex = new RegExp('[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')

  if (!regex.test(userId)) {
    error.statusCode = 400
    error.message = 'Id did not match the following regex: ' + regex
    error.name = 'bad request'
    return Promise.reject(error)
  }

  return userDB.deleteUser(userId)
}

/**
 * POST /user/login
 * @param {Object} req - the HTTP request object
 * @param {Object} res - the HTTP response object
 */
const loginUserRequestHandler = (req, res) => {
  logFunctionEntry('loginUserRequestHandler', false)

  // Steps to authenticate user
  // 1. Check user email exists
  // 2. Check password matches
  // 3. Generate jwt for user
  // 4. Send jwt back to ui

  module.exports.internal._getUserByEmail(req.userDb, req.body.email)
    .then(user => {
      return module.exports.internal._checkPassword(req.body.password, user[0].password)
        .then(() => Promise.resolve(user))
    })
    .then(user => {
      return module.exports.internal._loginUser(user[0])
    })
    .then(token => {
      res.status(200).send({auth: true, token: token})
    })
    .catch(error => {
      switch (error.statusCode) {
        case 400: {
          logger.error('Encountered bad request in the loginUserRequestHandler function', error)
          res.status(400).send(error)
          break
        }

        case 404: {
          logger.error('Encountered not found in the loginUserRequestHandler', error)
          res.status(404).send(error)
          break
        }

        case 500: {
          logger.error('Encountered internal server error in the loginUserRequestHandler', error)
          res.status(500).send(error)
          break
        }

        default: {
          logger.error('Encountered unexpected error in the loginUserRequestHandler', error)
          res.status(500).send(error)
          break
        }
      }
    })
}

/**
 * _checkPassword internal function
 *
 * @param {String} passwordToCheck - the password that the user has entered
 * @param {String} expectedPassword - the password that is stored in hash form in the database
 * @private
 */
const _checkPassword = (passwordToCheck, expectedPassword) => {
  logFunctionEntry('_checkPassword', true, undefined)
  return bcrypt.compare(passwordToCheck, expectedPassword)
    .then(res => {
      if (!res) {
        let error = {
          statusCode: 401,
          message: 'Password does not match',
          name: 'Not Authenticated'
        }
        return Promise.reject(error)
      } else {
        return Promise.resolve()
      }
    })
}

/**
 * _loginUser internal function
 *
 * @param {Object} user - the user to create a jwt for
 * @private
 */
const _loginUser = (user) => {
  logFunctionEntry('_loginUser', true, undefined)

  let payload = {
    id: user.id,
    name: user.name,
    email: user.email
  }

  let secret = process.env.JWT_SECRET

  let options = {
    expiresIn: '13h',
    issuer: 'opentrv'
  }

  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject(err)
      } else {
        resolve(token)
      }
    })
  })
}

module.exports = {
  createUserRequestHandler: createUserRequestHandler,
  getUsersRequestHandler: getUsersRequestHandler,
  getUserByIdRequestHandler: getUserByIdRequestHandler,
  updateUserRequestHandler: updateUserRequestHandler,
  deleteUserRequestHandler: deleteUserRequestHandler,
  loginUserRequestHandler: loginUserRequestHandler
}

module.exports.internal = {
  _createUser: _createUser,
  _getUsers: _getUsers,
  _getUserByEmail: _getUserByEmail,
  _getUserById: _getUserById,
  _updateUser: _updateUser,
  _deleteUser: _deleteUser,
  _checkPassword: _checkPassword,
  _loginUser: _loginUser
}

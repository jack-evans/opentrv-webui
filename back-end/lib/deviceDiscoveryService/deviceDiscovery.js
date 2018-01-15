'use strict'

// Device request helper
const bunyan = require('bunyan')
const Promise = require('bluebird')

const logger = bunyan.createLogger({name: 'device-discovery-service', serializers: bunyan.stdSerializers})

let firstTimeCalled = true

/**
 * POST /devices
 *
 * Request handler responsible for storing the basic information of the opentrv units in the IBM Cloudant database
 * @param {Object} req - the HTTP request object
 * @param {Object} res - the HTTP response object
 */
const createDeviceRequestHandler = (req, res) => {
  logger.info('Entered into the createDeviceRequestHandler function', req.body)

  let deviceDatabase = req.deviceDb
  const devices = req.body.devices
  module.exports.internal._createDevices(deviceDatabase, devices)
    .then(() => {
      logger.info('Successfully created device(s) in the Cloudant instance')
      res.status(201).end()
    })
    .catch(error => {
      switch (error.statusCode) {
        case 400: {
          logger.error('Encountered bad request in the createDeviceRequestHandler, reason: ', error)
          res.status(400).send(error)
          break
        }

        case 409: {
          logger.error('Encountered conflict in the createDeviceRequestHandler, reason: ', error)
          res.status(409).send(error)
          break
        }

        default: {
          logger.error('Encountered unexpected error in the createDeviceRequestHandler, reason: ', error)
          res.status(500).send(error)
          break
        }
      }
    })
}

/**
 * _createDevices function
 *
 * Saves the basic information of the devices to the IBM Cloudant database instance
 * @param {Object} database - the device database
 * @param {Array} devices - array of JSON objects retrieved from the opentrv server
 * @returns {Promise} on the action of saving device information to cloudant
 * @private
 */
const _createDevices = (database, devices) => {
  logger.info('Entered into the _createDevices internal function with', devices)

  if (!devices) {
    const error = {
      statusCode: 400,
      message: 'The devices array is undefined'
    }
    return Promise.reject(error)
  }

  let promises = []
  devices.forEach((device) => {
    promises.push(database.createDevice(device))
  })

  return Promise.all(promises)
}

/**
 * GET /devices
 *
 * Makes a call to the opentrv server and gets the information of all the devices
 * Sends the information back to the user as well as saving some of the static information in cloudant
 * @param {Object} req - the HTTP request object
 * @param {Object} res - the HTTP response object
 */
const discoverAllDevicesRequestHandler = (req, res) => {
  logger.info('Entered into the discoverAllDevicesRequestHandler function')

  let deviceDatabase = req.deviceDb
  let userTriggered = req.query.user
  module.exports.internal._discoverAllDevices(deviceDatabase, userTriggered)
    .then(devices => {
      logger.info('Successfully retrieved device(s) from the server', devices)
      res.status(200).send(devices)
    })
    .catch(error => {
      switch (error.statusCode) {
        case 400: {
          logger.error('Encountered bad request in the discoverAllDevicesRequestHandler, reason: ', error)
          res.status(400).send(error)
          break
        }

        case 404: {
          logger.error('Encountered not found in the discoverAllDevicesRequestHandler, reason: ', error)
          res.status(404).send(error)
          break
        }

        default: {
          logger.error('Encountered an unexpected error in the discoverAllDevicesRequestHandler, reason: ', error)
          res.status(500).send(error)
          break
        }
      }
    })
}

/**
 * _discoverAllDevices function
 *
 * Makes a call to the opentrv server that is connected to all the devices and retrieves the information of the devices
 * @param {Object} database - the device database
 * @param {Boolean} userFlag - determine if user triggers discovery or not
 * @returns {Promise} with an array of JSON objects on the action of retrieving the device information from the opentrv server
 * @private
 */
const _discoverAllDevices = (database, userFlag) => {
  logger.info('Entered into the _discoverAllDevices internal function', userFlag)

  userFlag = userFlag === 'yes'

  let createDevicesCalled = false
  return database.getAllDevices()
    .then(devices => {
      const numOfDevices = devices.length

      if (firstTimeCalled && numOfDevices < 1) {
        firstTimeCalled = false
        return Promise.resolve([])
      } else if (numOfDevices > 0) {
        return devices
      } else if (userFlag === true) {
        // Gives number of devices between 0 and 10
        let randomNumberOfDevices = Math.round((Math.random() * 10))
        let arrayOfDevices = []

        for (let i = 0; i < randomNumberOfDevices; i++) {
          const deviceName = `Device ${i + 1}`

          // Defines currentTemperature to be between 0 to 35 degrees celcius
          const deviceCurrentTemperature = _roundToOneDP(Math.random() * 35)
          const deviceSerialId = _generateSerialId()
          // If round produces 0 then activity is false and if 1 then activity is true
          const deviceActivity = !!Math.round(Math.random())

          arrayOfDevices.push({
            name: deviceName,
            currentTemperature: deviceCurrentTemperature,
            serialId: deviceSerialId,
            active: deviceActivity
          })
        }
        return Promise.resolve(arrayOfDevices)
      } else {
        return Promise.resolve([])
      }
    })
    .then(devices => {
      if (!devices || devices.length < 1 || devices[0].id) {
        return devices
      } else {
        createDevicesCalled = true
        return module.exports.internal._createDevices(database, devices)
      }
    })
    .then(devices => {
      if (createDevicesCalled) {
        return module.exports.internal._discoverAllDevices(database, false)
      } else {
        return devices
      }
    })
}

/**
 * GET /devices/:id
 *
 * Makes a call to the cloudant instance and returns the information for a specific device
 * @param {Object} req - the HTTP request object
 * @param {Object} res - the HTTP response object
 */
const getDeviceRequestHandler = (req, res) => {
  logger.info('Entered into the getDeviceRequestHandler function')

  let deviceId = req.params.id
  let database = req.deviceDb
  module.exports.internal._getDevice(database, deviceId)
    .then(device => {
      logger.info('Successfully retrieved device from the cloudant database', device)
      res.status(200).send(device)
    })
    .catch(error => {
      switch (error.statusCode) {
        case 400: {
          logger.error('Encountered bad request in the getDeviceRequestHandler, reason: ', error)
          res.status(400).send(error)
          break
        }

        case 404: {
          logger.error('Encountered not found in the getDeviceRequestHandler, reason: ', error)
          res.status(404).send(error)
          break
        }

        default: {
          logger.error('Encountered an unexpected error in the getDeviceRequestHandler, reason: ', error)
          res.status(500).send(error)
          break
        }
      }
    })
}

/**
 * _getDevice function
 *
 * Calls the device database to retrieve the device information
 * @param {Object} database - the device database
 * @param {String} deviceId - the id for the device document
 * @returns {Promise} on the action of retrieving the data from cloudant
 * @private
 */
const _getDevice = (database, deviceId) => {
  logger.info('Entered into the _getDevice internal function with device id:', deviceId)
  return database.getDeviceInformation(deviceId)
}

/**
 * PUT /devices/:id
 *
 * Updates the information for a device in the cloudant database
 * @param {Object} req - the HTTP request object
 * @param {Object} res - the HTTP response object
 */
const updateDeviceRequestHandler = (req, res) => {
  logger.info('Entered into the updateDeviceRequestHandler function')

  let device = req.body.device
  let database = req.deviceDb
  module.exports.internal._updateDevice(database, device)
    .then(() => {
      logger.info('Successfully updated device document in the cloudant database')
      res.status(200).end()
    })
    .catch(error => {
      switch (error.statusCode) {
        case 400: {
          logger.error('Encountered bad request in the updateDeviceRequestHandler, reason: ', error)
          res.status(400).send(error)
          break
        }

        case 409: {
          logger.error('Encountered conflict in the updateDeviceRequestHandler, reason: ', error)
          res.status(409).send(error)
          break
        }

        default: {
          logger.error('Encountered an unexpected error in the updateDeviceRequestHandler, reason: ', error)
          res.status(500).send(error)
          break
        }
      }
    })
}

/**
 * _updateDevice function
 *
 * Calls the device database to update the device information in cloudant with the data provided
 * @param {Object} database - the device database
 * @param {Object} device - data of the device to update with
 * @returns {Promise} on the action of updating device information to cloudant
 */
const _updateDevice = (database, device) => {
  logger.info('Entered into the _updateDevice internal function with the device: ', device)
  return database.updateDevice(device)
}

/**
 * DELETE /devices/:id
 *
 * Deletes a device from the cloudant database
 * @param {Object} req - the HTTP request object
 * @param {Object} res - the HTTP response object
 */
const deleteDeviceRequestHandler = (req, res) => {
  logger.info('Entered into the deleteDeviceRequestHandler function')

  let deviceId = req.params.id
  let database = req.deviceDb
  module.exports.internal._deleteDevice(database, deviceId)
    .then(() => {
      logger.info('Successfully deleted device from the cloudant database')
      res.status(204).end()
    })
    .catch(error => {
      switch (error.statusCode) {
        case 400: {
          logger.error('Encountered bad request in the deleteDeviceRequestHandler, reason: ', error)
          res.status(400).send(error)
          break
        }

        case 404: {
          logger.error('Encountered not found in the deleteDeviceRequestHandler, reason: ', error)
          res.status(404).send(error)
          break
        }

        default: {
          logger.error('Encountered an unexpected error in the deleteDeviceRequestHandler, reason: ', error)
          res.status(500).send(error)
          break
        }
      }
    })
}

/**
 * deleteDevice function
 *
 * Calls the device database to delete a device from the database
 * @param {Object} database - the device database
 * @param {Array} deviceId - the id of the device to be deleted
 * @returns {Promise} on the action of deleting a device in cloudant
 * @private
 */
const _deleteDevice = (database, deviceId) => {
  logger.info('Entered into the _deleteDevice internal function with the device id: ', deviceId)
  return database.deleteDevice(deviceId)
}

/**
 * _generateSerialId method
 *
 * Generates a 16 character alphanumeric unique string for the device
 * @returns {string} - "OTRV-" plus 16 alphanumeric values
 * @private
 */
const _generateSerialId = () => {
  let serialId = 'OTRV-'
  const possibleValues = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  for (let i = 0; i < 10; i++) {
    serialId += possibleValues.charAt(Math.floor(Math.random() * possibleValues.length))
  }
  return serialId
}

/**
 * _roundToOneDP method
 *
 * Rounds the value passed in to 1 decimal place
 * @param number
 * @returns {number}
 * @private
 */
const _roundToOneDP = (number) => {
  return Math.round(number * 10) / 10
}

/* TEST HELPER FUNCTIONS */

const _setFirstTimeCalled = (value) => {
  firstTimeCalled = value
}

module.exports = {
  createDeviceRequestHandler: createDeviceRequestHandler,
  discoverAllDevicesRequestHandler: discoverAllDevicesRequestHandler,
  getDeviceRequestHandler: getDeviceRequestHandler,
  updateDeviceRequestHandler: updateDeviceRequestHandler,
  deleteDeviceRequestHandler: deleteDeviceRequestHandler
}

module.exports.internal = {
  _createDevices: _createDevices,
  _discoverAllDevices: _discoverAllDevices,
  _getDevice: _getDevice,
  _updateDevice: _updateDevice,
  _deleteDevice: _deleteDevice,
  _generateSerialId: _generateSerialId,
  _roundToOneDP: _roundToOneDP,
  _setFirstTimeCalled: _setFirstTimeCalled
}

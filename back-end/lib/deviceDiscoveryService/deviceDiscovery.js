'use strict'

// Device request helper
const bunyan = require('bunyan')
const Promise = require('bluebird')
const rp = require('request-promise')

const logger = bunyan.createLogger({name: 'device-discovery-service', serializers: bunyan.stdSerializers})

let firstTimeCalled = true

/**
 * POST /devices
 *
 * Request handler responsible for storing the basic information of the opentrv units
 * @param {Object} req - the HTTP request object
 * @param {Object} res - the HTTP response object
 */
const createDeviceRequestHandler = (req, res) => {
  logger.info('Entered into the createDeviceRequestHandler function', req.body)

  const devices = req.body.devices
  module.exports.internal._createDevices(devices)
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
 * Saves the basic information of the devices
 * @param {Array} devices - array of JSON objects retrieved from the opentrv server
 * @returns {Promise} on the action of saving device information
 * @private
 */
const _createDevices = (devices) => {
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
    let options = {
      url: 'http://localhost:3002/api/v1/trv',
      method: 'POST',
      json: true,
      body: device
    }
    promises.push(rp(options))
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

  let userTriggered = req.query.user
  module.exports.internal._discoverAllDevices(userTriggered)
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
 * @param {Boolean} userFlag - determine if user triggers discovery or not
 * @returns {Promise} with an array of JSON objects on the action of retrieving the device information from the opentrv server
 * @private
 */
const _discoverAllDevices = (userFlag) => {
  logger.info('Entered into the _discoverAllDevices internal function', userFlag)

  let options = {
    url: 'http://localhost:3002/api/v1/trv',
    method: 'GET',
    json: true
  }

  userFlag = userFlag === 'yes'

  let createDevicesCalled = false

  logger.info('Making GET request to the gateway')
  return rp(options)
    .then(devices => {
      const numOfDevices = devices.length

      if (firstTimeCalled && numOfDevices < 1) {
        firstTimeCalled = false
        return Promise.resolve([])
      } else if (numOfDevices > 0) {
        logger.info('Found devices on the gateway', devices)
        return devices
      } else if (userFlag === true) {
        // Gives number of devices between 0 and 10
        let randomNumberOfDevices = Math.round((Math.random() * 10))
        let arrayOfDevices = []

        for (let i = 0; i < randomNumberOfDevices; i++) {
          const deviceName = `Device ${i + 1}`

          // Defines currentTemperature to be between 0 to 35 degrees celcius
          const deviceCurrentTemperature = _roundToOneDP((Math.random() * 25) + 10)

          arrayOfDevices.push({
            name: deviceName,
            currentTemperature: deviceCurrentTemperature
          })
        }
        logger.info('Created an array of devices', arrayOfDevices)
        return Promise.resolve(arrayOfDevices)
      } else {
        return Promise.resolve([])
      }
    })
    .then(devices => {
      if (!devices || devices.length < 1 || devices[0].id) {
        return Promise.resolve(devices)
      } else {
        createDevicesCalled = true
        logger.info('Calling the _createDevices internal function with: ', devices)
        return module.exports.internal._createDevices(devices)
      }
    })
    .then(devices => {
      if (createDevicesCalled) {
        logger.info('_createDevices internal function was called so now need to call the _discoverAllDevices internal function again')
        return module.exports.internal._discoverAllDevices('no')
      } else {
        return Promise.resolve(devices)
      }
    })
    .catch(error => {
      logger.error('Encountered error in the _discoverAllDevices function', error)
      return Promise.reject(error)
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
  module.exports.internal._getDevice(deviceId)
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
 * @param {String} deviceId - the id for the device document
 * @returns {Promise} on the action of retrieving the data from cloudant
 * @private
 */
const _getDevice = (deviceId) => {
  logger.info('Entered into the _getDevice internal function with device id:', deviceId)
  let options = {
    url: 'http://localhost:3002/api/v1/trv/' + deviceId,
    method: 'GET',
    json: true
  }

  logger.info('Making GET request to retrieve ' + deviceId + ' from the gateway')
  return rp(options)
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
  module.exports.internal._updateDevice(device)
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
 * Calls the device database to update the device information with the data provided
 * @param {Object} device - data of the device to update with
 * @returns {Promise} on the action of updating device information to cloudant
 */
const _updateDevice = (device) => {
  logger.info('Entered into the _updateDevice internal function with the device: ', device)

  let options = {
    url: 'http://localhost:3002/api/v1/trv/' + device.id,
    method: 'PUT',
    json: true,
    body: device
  }

  logger.info('Making PUT request to the internet gateway')
  return rp(options)
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
  module.exports.internal._deleteDevice(deviceId)
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
 * @param {Array} deviceId - the id of the device to be deleted
 * @returns {Promise} on the action of deleting a device in cloudant
 * @private
 */
const _deleteDevice = (deviceId) => {
  logger.info('Entered into the _deleteDevice internal function with the device id: ', deviceId)

  let options = {
    url: 'http://localhost:3002/api/v1/trv/' + deviceId,
    method: 'DELETE',
    json: true
  }
  logger.info('Making DELETE request to remove ' + deviceId + ' from the gateway')
  return rp(options)
}

/**
 * _roundToOneDP method
 *
 * Rounds the value passed in to 1 decimal place
 * @param number - the number to be rounded
 * @returns {number} a number with 1 decimal place
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
  _roundToOneDP: _roundToOneDP,
  _setFirstTimeCalled: _setFirstTimeCalled
}

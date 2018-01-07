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
  module.exports.internal._saveDeviceBasicInformation(deviceDatabase, devices)
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
 * _saveDeviceBasicInformation function
 *
 * Saves the basic information of the devices to the IBM Cloudant database instance
 * @param {Object} database - the device database
 * @param {Array} devices - array of JSON objects retrieved from the opentrv server
 * @returns {Promise} on the action of saving device information to cloudant
 * @private
 */
const _saveDeviceBasicInformation = (database, devices) => {
  logger.info('Entered into the _saveDeviceBasicInformation internal function with', devices)

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
  module.exports.internal._discoverAllDevices(deviceDatabase)
    .then((devices) => {
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
 * @returns {Promise} with an array of JSON objects on the action of retrieving the device information from the opentrv server
 * @private
 */
const _discoverAllDevices = (database) => {
  logger.info('Entered into the _discoverAllDevices internal function')

  return database.getAllDevices()
    .then((devices) => {
      const numOfDevices = devices.length

      if (firstTimeCalled && numOfDevices < 1) {
        firstTimeCalled = false
        return Promise.resolve([])
      } else if (numOfDevices > 0) {
        return devices
      } else {
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
      }
    })
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
  discoverAllDevicesRequestHandler: discoverAllDevicesRequestHandler
}

module.exports.internal = {
  _saveDeviceBasicInformation: _saveDeviceBasicInformation,
  _discoverAllDevices: _discoverAllDevices,
  _generateSerialId: _generateSerialId,
  _roundToOneDP: _roundToOneDP,
  _setFirstTimeCalled: _setFirstTimeCalled
}

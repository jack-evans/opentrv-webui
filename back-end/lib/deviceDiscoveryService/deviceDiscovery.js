'use strict'

// Device request helper
const bunyan = require('bunyan')

const logger = bunyan.createLogger({name: 'device-discovery-service-db', serializers: bunyan.stdSerializers})

/**
 * POST /devices
 *
 * Request handler responsible for storing the basic information of the opentrv units in the IBM Cloudant database
 * @param {Object} req - the HTTP request object
 * @param {Object} res - the HTTP response object
 */
const createDeviceRequestHandler = (req, res) => {
  logger.info('Entered into the createDeviceRequestHandler function')

  const devices = req.body.devices
  module.exports.internal._saveDeviceBasicInformation(devices)
    .then(() => {
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
 * @param {Array} devices - array of JSON objects retrieved from the opentrv server
 * @returns {Promise} on the action of saving device information to cloudant
 * @private
 */
const _saveDeviceBasicInformation = (devices) => {
  logger.info('Entered into the _saveDeviceBasicInformation internal function with', devices)
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

  module.exports.internal._discoverAllDevices()
    .then((devices) => {
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
 * @returns {Promise} with an array of JSON objects on the action of retrieving the device information from the opentrv server
 * @private
 */
const _discoverAllDevices = () => {
  logger.info('Entered into the _discoverAllDevices internal function')

  // TODO: Remove and replace with request to opentrv server to get information
  return Promise.resolve([{}, {}, {}, {}, {}])
}

module.exports = {
  createDeviceRequestHandler: createDeviceRequestHandler,
  discoverAllDevicesRequestHandler: discoverAllDevicesRequestHandler
}

module.exports.internal = {
  _saveDeviceBasicInformation: _saveDeviceBasicInformation,
  _discoverAllDevices: _discoverAllDevices
}

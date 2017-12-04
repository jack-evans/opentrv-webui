'use strict'

// Device request helper
const bunyan = require('bunyan')

const logger = bunyan.createLogger({name: 'device-discovery-service-db', serializers: bunyan.stdSerializers})

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
    .then(() => {
      res.status(200).end()
    })
    .catch(error => {
      switch (error.statusCode) {
        case 400: {
          logger.error('Encountered bad request in the discoverAllDevicesRequestHandler, reason: ', error)
          res.status(400).send(error)
          break
        }

        case 404: {
          res.status(404).send(error)
          break
        }

        default: {
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
}

/**
 * _saveDeviceBasicInformation function
 *
 * @param {Array} devices - array of JSON objects retrieved from the opentrv server
 * @returns {Promise} on the action of saving device information to cloudant
 * @private
 */
const _saveDeviceBasicInformation = (devices) => {
  logger.info('Entered into the _saveDeviceBasicInformation internal function with', devices)
}

module.exports = {
  discoverAllDevicesRequestHandler: discoverAllDevicesRequestHandler
}

module.exports.internal = {
  _discoverAllDevices: _discoverAllDevices,
  _saveDeviceBasicInformation: _saveDeviceBasicInformation
}

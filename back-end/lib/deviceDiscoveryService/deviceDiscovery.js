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
      return module.exports.internal._saveDeviceBasicInformation()
    })
    .then(() => {
      res.status(200).end()
    })
    .catch(error => {
      switch (error.statusCode) {
        case 400: {
          logger.error('Encountered bad request in the discoverAllDevicesRequestHandler, reason: ', error)
          res.status(400).send(error).end()
          break
        }

        case 404: {
          res.status(404).send(error).end()
          break
        }

        default: {
          res.status(500).send(error).end()
          break
        }
      }
    })
}

/**
 * _discoverAllDevices function
 *
 * Makes a call to the
 * @private
 */
const _discoverAllDevices = () => {
  logger.info('Entered into the _discoverAllDevices internal function')
}

const _saveDeviceBasicInformation = () => {
  logger.info('Entered into the _saveDeviceBasicInformation internal function')
}

module.exports = {
  discoverAllDevicesRequestHandler: discoverAllDevicesRequestHandler
}

module.exports.internal = {
  _discoverAllDevices: _discoverAllDevices,
  _saveDeviceBasicInformation: _saveDeviceBasicInformation
}

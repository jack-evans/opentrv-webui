'use strict'

const deviceDiscoveryService = require('./lib/deviceDiscoveryService/deviceDiscovery')
const router = require('express').Router()
const packageJson = require('../package.json')

// DeviceDiscoveryService
router.post('/devices', deviceDiscoveryService.createDeviceRequestHandler)
router.get('/devices', deviceDiscoveryService.discoverAllDevicesRequestHandler)

router.get('/test', (req, res) => {
  res.status(200).send({'time': new Date(), 'name': packageJson.name, 'version': packageJson.version})
})

module.exports = router

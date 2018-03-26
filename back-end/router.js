'use strict'

const deviceDiscoveryService = require('./lib/deviceDiscoveryService/deviceDiscovery')
const packageJson = require('../package.json')
const router = require('express').Router()
const userService = require('./lib/userService/user')

// DeviceDiscoveryService
router.post('/devices', deviceDiscoveryService.createDeviceRequestHandler)
router.get('/devices', deviceDiscoveryService.discoverAllDevicesRequestHandler)
router.get('/devices/:id', deviceDiscoveryService.getDeviceRequestHandler)
router.put('/devices/:id', deviceDiscoveryService.updateDeviceRequestHandler)
router.delete('/devices/:id', deviceDiscoveryService.deleteDeviceRequestHandler)

// UserService
router.post('/user', userService.createUserRequestHandler)
router.get('/user/:id', userService.getUserRequestHandler)
router.put('/user/:id', userService.updateUserRequestHandler)
router.delete('/user/:id', userService.deleteUserRequestHandler)

// AuthenticationService

router.get('/test', (req, res) => {
  res.status(200).send({'time': new Date(), 'name': packageJson.name, 'version': packageJson.version})
})

module.exports = router

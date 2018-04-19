'use strict'

const deviceDiscoveryService = require('./lib/deviceDiscoveryService/deviceDiscovery')
const packageJson = require('../package.json')
const router = require('express').Router()
const userService = require('./lib/userService/user')
const verifyToken = require('./lib/middleware/verifyToken')

// DeviceDiscoveryService
router.post('/devices', verifyToken, deviceDiscoveryService.createDeviceRequestHandler)
router.get('/devices', verifyToken, deviceDiscoveryService.discoverAllDevicesRequestHandler)
router.get('/devices/:id', verifyToken, deviceDiscoveryService.getDeviceRequestHandler)
router.put('/devices/:id', verifyToken, deviceDiscoveryService.updateDeviceRequestHandler)
router.delete('/devices/:id', verifyToken, deviceDiscoveryService.deleteDeviceRequestHandler)

// UserService
router.post('/user', userService.createUserRequestHandler)
router.get('/user', userService.getUsersRequestHandler)
router.get('/user/:id', verifyToken, userService.getUserByIdRequestHandler)
router.put('/user/:id', verifyToken, userService.updateUserRequestHandler)
router.delete('/user/:id', verifyToken, userService.deleteUserRequestHandler)

// AuthenticationService
router.post('/user/login', userService.loginUserRequestHandler)

// PolicyManagementService TODO

router.get('/test', (req, res) => {
  res.status(200).send({'time': new Date(), 'name': packageJson.name, 'version': packageJson.version})
})

module.exports = router

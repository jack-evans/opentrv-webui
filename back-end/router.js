const deviceDiscoveryService = require('./lib/deviceDiscoveryService/deviceDiscovery')
const packageJson = require('../package.json')
const policyManagementService = require('./lib/policyManagementService/policyManagement.js')
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
router.get('/user', verifyToken, userService.getUserByIdRequestHandler)
router.put('/user/:id', verifyToken, userService.updateUserRequestHandler)
router.delete('/user/:id', verifyToken, userService.deleteUserRequestHandler)

// AuthenticationService
router.post('/user/login', userService.loginUserRequestHandler)

// PolicyManagementService
router.post('/policy', verifyToken, policyManagementService.createPolicyRequestHandler)
router.get('/policy', verifyToken, policyManagementService.getAllPoliciesRequestHandler)
router.get('/policy/:id', verifyToken, policyManagementService.getPolicyByIdRequestHandler)
router.put('/policy/:id', verifyToken, policyManagementService.updatePolicyRequestHandler)
router.delete('/policy/:id', verifyToken, policyManagementService.deletePolicyRequestHandler)

router.get('/test', (req, res) => {
  res.status(200).send({'time': new Date(), 'name': packageJson.name, 'version': packageJson.version})
})

module.exports = router

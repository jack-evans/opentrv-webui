'use strict'

const bodyParser = require('body-parser')
const express = require('express')

const app = express()

// Device Database
const DeviceDatabase = require('./lib/deviceDiscoveryService/deviceDatabase')
const deviceDb = new DeviceDatabase()
deviceDb.initialise()

// User Database
const UserDatabase = require('./lib/userService/userDatabase')
const userDb = new UserDatabase()
userDb.initialise()

const PolicyManagementDatabase = require('./lib/policyManagementService/policyManagementDatabase')
const policyDb = new PolicyManagementDatabase()
policyDb.initialise()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use((req, res, next) => {
  req.deviceDb = deviceDb
  req.userDb = userDb
  req.policyDb = policyDb
  next()
})

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, x-opentrv-token, Accept')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})

const router = require('./router.js')
app.use('/api/v1', router)

module.exports = app

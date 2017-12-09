'use strict'

const bodyParser = require('body-parser')
const express = require('express')

const app = express()

const DeviceDatabase = require('./lib/deviceDiscoveryService/deviceDatabase')
const deviceDb = new DeviceDatabase()
deviceDb.initialise()

app.use((req, res, next) => {
  req.deviceDb = deviceDb
  next()
})

app.use(bodyParser.json())

const router = require('./router.js')
app.use('/api/v1', router)

module.exports = app

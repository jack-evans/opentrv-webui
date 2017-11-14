'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const router = require('./router.js')

const DeviceDatabase = require('./lib/deviceDiscoveryService/deviceDatabase')
const deviceDb = new DeviceDatabase()

const app = express()

deviceDb.initialise()

app.set('deviceDb', deviceDb)

app.use(bodyParser.json())

app.use('/api/v1', router)

module.exports = app

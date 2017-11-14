'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const router = require('./router.js')

const app = express()

app.use(bodyParser.json())

app.use('/api/v1', router)

module.exports = app
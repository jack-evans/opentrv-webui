'use strict'

const express = require('express')
const router = require('./router.js')

const app = express()

const SERVER_PORT = process.env.SERVER_PORT || 3001

app.use('/api/v1', router)

app.listen(SERVER_PORT, () => {
  console.log(`server listening on port ${SERVER_PORT}`)
})

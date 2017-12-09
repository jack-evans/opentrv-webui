'use strict'

const app = require('./app')
const SERVER_PORT = process.env.SERVER_PORT || 3001

app.listen(SERVER_PORT, () => {
  console.log(`server listening on port ${SERVER_PORT}`)
})

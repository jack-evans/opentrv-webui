'use strict'

const router = require('express').Router()

router.get('/time', (req, res) => {
  res.status(200).send({'time': new Date()})
})

module.exports = router

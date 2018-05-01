const fs = require('fs')
const jwt = require('jsonwebtoken')
const path = require('path')

const verifyToken = (req, res, next) => {
  const token = req.headers['x-opentrv-token']

  if (!token) {
    return res.status(403).send({ auth: false, message: 'No token provided.' })
  }

  fs.readFile(path.normalize('../jwtRS256.key.pub'), {encoding: 'utf8'}, (err, secret) => {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to verify token.' })
    }
    const options = {
      algorithms: ['RS256'],
      issuer: 'opentrv'
    }

    jwt.verify(token, secret, options, (err, decoded) => {
      if (err) {
        return res.status(500).send({ auth: false, message: 'Failed to verify token.' })
      } else {
        req.userId = decoded.id
        next()
      }
    })
  })
}

module.exports = verifyToken

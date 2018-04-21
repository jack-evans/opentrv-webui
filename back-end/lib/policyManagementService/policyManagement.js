
const bunyan = require('bunyan')

const logger = bunyan.createLogger({name: 'policy-management-service', serializers: bunyan.stdSerializers})

const createPolicyRequestHandler = (req, res) => {
  logger.info('Entered into the createPolicyRequestHandler function')
  module.exports.internal._createPolicy(req.policyDb, req.body, req.userId)
    .then(policyDocument => {
      logger.info('Successfully created a policy document in the policies database', policyDocument)
      res.status(201).send(policyDocument)
    })
    .catch(error => {
      switch (error.statusCode) {
        case 400: {
          logger.error('Encountered bad request in the createPolicyRequestHandler', error)
          res.status(400).send(error)
          break
        }

        case 409: {
          logger.error('Encountered conflict in the createPolicyRequestHandler', error)
          res.status(409).send(error)
          break
        }

        case 500: {
          logger.error('Encountered internal server error in the createPolicyRequestHandler', error)
          res.status(500).send(error)
          break
        }

        default: {
          logger.error('Encountered unexpected error in the createPolicyRequestHandler', error)
          res.status(500).send(error)
          break
        }
      }
    })
}

const _createPolicy = (policyDb, policyDoc, userId) => {
  logger.info('Entered into the _createPolicy internal function with the following: ', {})
}

const getAllPoliciesRequestHandler = (req, res) => {
  logger.info('Entered into the getAllPoliciesRequestHandler function')
  module.exports.internal._getAllPolicies(req.policyDb)
    .then(policyDocuments => {
      logger.info('Successfully retrieved all policies from the database and gateway', policyDocuments)
      res.status(200).send(policyDocuments)
    })
    .catch(error => {
      switch (error.statusCode) {
        case 400: {
          logger.error('Encountered bad request in the getAllPoliciesRequestHandler', error)
          res.status(400).send(error)
          break
        }

        case 404: {
          logger.error('Encountered conflict in the getAllPoliciesRequestHandler', error)
          res.status(404).send(error)
          break
        }

        case 500: {
          logger.error('Encountered internal server error in the getAllPoliciesRequestHandler', error)
          res.status(500).send(error)
          break
        }

        default: {
          logger.error('Encountered unexpected error in the getAllPoliciesRequestHandler', error)
          res.status(500).send(error)
          break
        }
      }
    })
}

const _getAllPolicies = () => {
}

const getPolicyByIdRequestHandler = (req, res) => {
  logger.info('Entered into the getPolicyByIdRequestHandler function')
  module.exports.internal._getPolicyById(req.policyDb, req.params.id)
    .then(policyDocument => {
      logger.info('Successfully retrieved the policy', policyDocument)
      res.status(200).send(policyDocument)
    })
    .catch(error => {
      switch (error.statusCode) {
        case 400: {
          logger.error('Encountered bad request in the getPolicyByIdRequestHandler', error)
          res.status(400).send(error)
          break
        }

        case 404: {
          logger.error('Encountered conflict in the getPolicyByIdRequestHandler', error)
          res.status(404).send(error)
          break
        }

        case 500: {
          logger.error('Encountered internal server error in the getPolicyByIdRequestHandler', error)
          res.status(500).send(error)
          break
        }

        default: {
          logger.error('Encountered unexpected error in the getPolicyByIdRequestHandler', error)
          res.status(500).send(error)
          break
        }
      }
    })
}

const _getPolicyById = () => {

}

const updatePolicyRequestHandler = (req, res) => {
  logger.info('Entered into the updatePolicyRequestHandler function')
  module.exports.internal._updatePolicy(req.policyDb, req.body)
    .then(policyDocument => {
      logger.info('Successfully updated the policy document', policyDocument)
      res.status(200).send(policyDocument)
    })
    .catch(error => {
      switch (error.statusCode) {
        case 400: {
          logger.error('Encountered bad request in the updatePolicyRequestHandler', error)
          res.status(400).send(error)
          break
        }

        case 409: {
          logger.error('Encountered conflict in the updatePolicyRequestHandler', error)
          res.status(409).send(error)
          break
        }

        case 500: {
          logger.error('Encountered internal server error in the updatePolicyRequestHandler', error)
          res.status(500).send(error)
          break
        }

        default: {
          logger.error('Encountered unexpected error in the updatePolicyRequestHandler', error)
          res.status(500).send(error)
          break
        }
      }
    })
}

const _updatePolicy = () => {

}

const deletePolicyRequestHandler = (req, res) => {
  logger.info('Entered into the deletePolicyRequestHandler function')
  module.exports.internal._deletePolicy(req.policyDb, req.params.id)
    .then(() => {
      logger.info('Successfully deleted the policy')
      res.status(204).send({})
    })
    .catch(error => {
      switch (error.statusCode) {
        case 400: {
          logger.error('Encountered bad request in the deletePolicyRequestHandler', error)
          res.status(400).send(error)
          break
        }

        case 404: {
          logger.error('Encountered not found in the deletePolicyRequestHandler', error)
          res.status(404).send(error)
          break
        }

        case 500: {
          logger.error('Encountered internal server error in the deletePolicyRequestHandler', error)
          res.status(500).send(error)
          break
        }

        default: {
          logger.error('Encountered unexpected error in the deletePolicyRequestHandler', error)
          res.status(500).send(error)
          break
        }
      }
    })
}

const _deletePolicy = () => {

}

module.exports = {
  createPolicyRequestHandler: createPolicyRequestHandler,
  getAllPoliciesRequestHandler: getAllPoliciesRequestHandler,
  getPolicyByIdRequestHandler: getPolicyByIdRequestHandler,
  updatePolicyRequestHandler: updatePolicyRequestHandler,
  deletePolicyRequestHandler: deletePolicyRequestHandler
}

module.exports.internal = {
  _createPolicy: _createPolicy,
  _getAllPolicies: _getAllPolicies,
  _getPolicyById: _getPolicyById,
  _updatePolicy: _updatePolicy,
  _deletePolicy: _deletePolicy
}
